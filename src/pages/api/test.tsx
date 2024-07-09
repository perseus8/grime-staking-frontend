export default function handler(req: any, res: any) {
    // Example data
    const data = {
      message: 'This is an example API respon123123se',
      timestamp: new Date().toISOString()
    };
  
    // Set response status and headers
    res.status(200).json(data);
  }