const jwt=require('jsonwebtoken');
const JWT_TOKEN='yuviabhi0012';
async function usermiddleware(req,res,next){
    const token = req.header('token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }

}
module.exports=usermiddleware;