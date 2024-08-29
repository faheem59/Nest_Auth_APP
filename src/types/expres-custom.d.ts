// src/types/express-custom.d.ts

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
