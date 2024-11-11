import cors from 'cors';
export default cors({
    origin: '*', // Allow all origins (for testing purposes; adjust as needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
