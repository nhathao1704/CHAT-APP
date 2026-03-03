import Friend from "../models/Friend";
import FriendRequest from "../models/FriendRequest";

const sendFriendRequest = async (req,res)=>{
    try{
        const from = req.userId || req.user?.id;
        const { to } = req.body;
        if(from === to){
            return res.status(400),json({message:"khong the gui ket ban cho chinh minh"})
        }
        const existingFriend = await Friend.findOne({
            $or:[
                {userA:from, userB:to},
                {userB:to, userA: from},
            ]
        });
        if(existingFriend){
            return res.status(400).json({message:"da la ban roi"})
        }
        const request = await FriendRequest.create({from,to});
        res.status(201).json({
            message:"gui loi moi thanh cong",
            request,
        })
    }
    catch(error){
        res.status(500).json({message:"loi server"},error);
    }
}


const accessRequest = async(req, res)=>{
    try{
        const userId = req.userId || req.user?.id;
        const {requestId }= req.body;
        const request =await FriendRequest.findById(requestId);
        if(!request){
            return res.status(401).json({message:"khong co loi moi kb"})
        }
        if (request.to.toString() !== userId) {
            return res.status(403).json({ message: "Không có quyền" });
        }
        await Friend.create({
            userA: request.from,
            userB:request.to,
        });
        await request.deleteOne();
    }
    catch(error){
        res.status(500).json({message:"loi server"},error);
    }
}

const rejectFriendRequest = async (req,res)=>{
    try{
        const userId = req.user.id||req.user?.id;
        const {requestId} = req.body
        const request = await FriendRequest.findById(requestId)
        if(!request){
            return res.status(401).json({message:"ko co loi moi kb"})

        };
          if (request.to.toString() !== userId) {
            return res.status(403).json({ message: "Không có quyền" });
        };
        await request.deleteOne()
        res.json({message:"Da tu choi loi moi"})
    }
    catch(error){
        res.status(500).json({message:"loi server"},error)
    }
}


const getFriend = async (req,res)=>{
    try{
        const userId= req.user.id;
        const friends = await Friend.find({
            $or:[{userA: userId},{userB: userId}],
        }).populate("userA userB","name email avatar");
        res.json(friends);
    }

    catch(error){
        res.status(500).json({message:"loi server"},error)
    }
}
export {sendFriendRequest,rejectFriendRequest,accessRequest,getFriend}