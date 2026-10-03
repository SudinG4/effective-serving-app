import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dotenv from 'dotenv';

import {
  supabase
} from './config/supabase.js';

import authRoutes
  from './routes/authRoutes.js';

import assessmentRoutes
  from './routes/assessmentRoutes.js';

dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 5001;

app.use(
  cors({
    origin:
      'http://localhost:5173',
    credentials: true
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.get(
  '/',
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        'Welcome to the WellBeingCheck API'
    });
  }
);

app.get(
  '/api/health',
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        'WellBeingCheck backend is running',
      timestamp:
        new Date().toISOString()
    });
  }
);

app.get(
  '/api/supabase-test',
  async (req, res) => {
    try {
      const {
        error
      } =
        await supabase
          .from('assessments')
          .select('id')
          .limit(1);

      if (error) {
        return res
          .status(500)
          .json({
            success: false,
            message:
              'Supabase connection failed',
            error:
              error.message
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          message:
            'Supabase connection is working'
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            'Supabase connection failed',
          error:
            error.message
        });
    }
  }
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/assessments',
  assessmentRoutes
);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(
  '/api',
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        'API endpoint not found'
    });
  }
);

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      'Server error:',
      err
    );

    res
      .status(
        err.status || 500
      )
      .json({
        success: false,
        message:
          err.message ||
          'Internal server error'
      });
  }
);

const server =
  app.listen(
    PORT,
    () => {
      console.log('');
      console.log(
        '---------------------------------------'
      );
      console.log(
        ' WellBeingCheck Backend'
      );
      console.log(
        '---------------------------------------'
      );
      console.log(
        ` Server: http://localhost:${PORT}`
      );
      console.log(
        ` Health: http://localhost:${PORT}/api/health`
      );
      console.log(
        ` Supabase: http://localhost:${PORT}/api/supabase-test`
      );
      console.log(
        ` Register: POST http://localhost:${PORT}/api/auth/register`
      );
      console.log(
        ` Login: POST http://localhost:${PORT}/api/auth/login`
      );
      console.log(
        ` Assessments: http://localhost:${PORT}/api/assessments`
      );
      console.log(
        '---------------------------------------'
      );
      console.log('');
    }
  );

server.on(
  'error',
  (error) => {
    console.error(
      'Failed to start server:',
      error
    );
  }
);
