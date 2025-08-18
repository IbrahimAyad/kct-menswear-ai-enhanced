Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const requestData = await req.json();
        const { action, order_data, order_id, filters } = requestData;

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let result;

        switch (action) {
            case 'create_order_queue_entry': {
                console.log('Creating order queue entry:', order_data);
                
                // Generate unique order number if not provided
                if (!order_data.order_id) {
                    order_data.order_id = `KCT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
                }

                const orderEntry = {
                    order_number: order_data.order_id,
                    customer_email: order_data.customer_email,
                    customer_name: order_data.customer_name,
                    customer_phone: order_data.customer_phone || null,
                    total_amount: order_data.total_amount,
                    status: 'pending_payment',
                    currency: 'usd',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(orderEntry)
                });

                if (!orderResponse.ok) {
                    const errorText = await orderResponse.text();
                    console.error('Failed to create order:', errorText);
                    throw new Error(`Failed to create order: ${errorText}`);
                }

                const order = await orderResponse.json();
                const orderId = order[0].id;

                // Create order items if provided
                if (order_data.items && order_data.items.length > 0) {
                    const orderItems = order_data.items.map(item => ({
                        order_id: orderId,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price_at_time: item.price,
                        product_name: item.product_name,
                        size: item.size || null,
                        color: item.color || null,
                        sku: item.sku || null,
                        created_at: new Date().toISOString()
                    }));

                    await fetch(`${supabaseUrl}/rest/v1/order_items`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orderItems)
                    });
                }

                result = {
                    data: {
                        id: orderId,
                        order_number: order_data.order_id,
                        status: 'pending_payment'
                    }
                };
                break;
            }

            case 'update_order_status': {
                console.log('Updating order status:', order_id, order_data);
                
                const updateData = {
                    status: order_data.new_status,
                    updated_at: new Date().toISOString()
                };

                if (order_data.notes) {
                    updateData.internal_notes = order_data.notes;
                }

                if (order_data.new_status === 'shipped') {
                    updateData.shipped_at = new Date().toISOString();
                }

                if (order_data.new_status === 'delivered') {
                    updateData.delivered_at = new Date().toISOString();
                }

                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(updateData)
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.error('Failed to update order:', errorText);
                    throw new Error(`Failed to update order: ${errorText}`);
                }

                const updatedOrder = await updateResponse.json();
                result = {
                    data: updatedOrder[0]
                };
                break;
            }

            case 'get_order_analytics': {
                console.log('Getting order analytics with filters:', filters);
                
                // Build query with filters
                let query = `${supabaseUrl}/rest/v1/orders?select=*`;
                
                if (filters?.status) {
                    query += `&status=eq.${filters.status}`;
                }
                if (filters?.start_date) {
                    query += `&created_at=gte.${filters.start_date}`;
                }
                if (filters?.end_date) {
                    query += `&created_at=lte.${filters.end_date}`;
                }
                
                query += '&order=created_at.desc';
                
                const analyticsResponse = await fetch(query, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!analyticsResponse.ok) {
                    const errorText = await analyticsResponse.text();
                    console.error('Failed to get analytics:', errorText);
                    throw new Error(`Failed to get analytics: ${errorText}`);
                }

                const orders = await analyticsResponse.json();
                
                // Calculate analytics
                const totalOrders = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
                const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                
                result = {
                    data: {
                        totalOrders,
                        totalRevenue,
                        averageOrderValue,
                        orders: orders.slice(0, 50) // Return latest 50 orders
                    }
                };
                break;
            }

            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Order management error:', error);

        const errorResponse = {
            error: {
                code: 'ORDER_MANAGEMENT_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
