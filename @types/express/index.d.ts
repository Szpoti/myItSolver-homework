export {};
declare global{
    namespace Express {
        interface Request {
            platform: { name: string }
        }
    }
}
