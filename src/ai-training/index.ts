#!/usr/bin/env tsx

import { TrainingPipeline } from './train';
import { AIEvaluator } from './evaluation/evaluate';
import { startServer } from './api/server';
import { Command } from 'commander';

const program = new Command();

program
  .name('kct-ai-training')
  .description('KCT Menswear AI Training Pipeline')
  .version('1.0.0');

program
  .command('train')
  .description('Run the complete training pipeline')
  .option('--recreate', 'Recreate vector database collection')
  .action(async (options) => {
    try {
      if (options.recreate) {
        process.env.RECREATE_COLLECTION = 'true';
      }
      
      console.log('Starting training pipeline...\n');
      const pipeline = new TrainingPipeline();
      await pipeline.run();
      
      console.log('\n✅ Training completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Training failed:', error);
      process.exit(1);
    }
  });

program
  .command('evaluate')
  .description('Evaluate the trained AI system')
  .action(async () => {
    try {
      console.log('Starting evaluation...\n');
      const evaluator = new AIEvaluator();
      await evaluator.runEvaluation();
      
      console.log('\n✅ Evaluation completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Evaluation failed:', error);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the AI API server')
  .option('-p, --port <port>', 'Port to run the server on', '3001')
  .action(async (options) => {
    try {
      if (options.port) {
        process.env.AI_API_PORT = options.port;
      }
      
      console.log('Starting API server...\n');
      await startServer();
    } catch (error) {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Run training, evaluation, and start server')
  .action(async () => {
    try {
      // Run training
      console.log('Step 1: Training...\n');
      const pipeline = new TrainingPipeline();
      await pipeline.run();
      
      console.log('\n' + '='.repeat(50));
      
      // Run evaluation
      console.log('\nStep 2: Evaluation...\n');
      const evaluator = new AIEvaluator();
      await evaluator.runEvaluation();
      
      console.log('\n' + '='.repeat(50));
      
      // Start server
      console.log('\nStep 3: Starting server...\n');
      await startServer();
    } catch (error) {
      console.error('❌ Full pipeline failed:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);