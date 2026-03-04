import mongoose from "mongoose";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";

const sendFriendRequest = async (req,res)=>{
    try{
        const from = req.userId || req.user?.id;
        const { to } = req.body;
        if(from === to){
            return res.status(400).json({message:"khong the gui ket ban cho chinh minh"})
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
        console.log('userId:', userId, 'requestId:', requestId);
        const request =await FriendRequest.findById(requestId);
        if(!request){
            return res.status(401).json({message:"khong co loi moi kb"})
        }
        console.log('request.to:', request.to.toString(), 'userId:', userId);
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Không có quyền" });
        }
        const newFriend = await Friend.create({
            userA: request.from,
            userB: request.to,
        });
        console.log('Friend created:', newFriend);
        await request.deleteOne();
        res.json({message:"Chấp nhận thành công"});
    }
    catch(error){
        console.error('accept error:', error);
        res.status(500).json({message:"loi server", details: error.message});
    }
}

const rejectFriendRequest = async (req,res)=>{
    try{
        const userId = req.userId || req.user?.id;
        const {requestId} = req.body
        const request = await FriendRequest.findById(requestId)
        if(!request){
            return res.status(401).json({message:"ko co loi moi kb"})

        };
           if (request.to.toString() !== userId.toString()) {
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
        const userId = req.userId || req.user?.id;
        const friendDocs = await Friend.find({
            $or:[{userA: userId},{userB: userId}],
        }).populate("userA userB","username name avatar email");
        
        // transform to array of friend user objects
        const friends = friendDocs.map(f => {
            const friendUser = f.userA._id.toString() === userId ? f.userB : f.userA;
            return friendUser;
        });
        
        res.json(friends);
    }
    catch(error){
        res.status(500).json({message:"loi server"},error)
    }
}

// new endpoint: incoming friend requests
const getFriendRequests = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const requests = await FriendRequest.find({ to: userId }).populate(
            "from",
            "username avatar"
        );
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "loi server", error });
    }
};

export {sendFriendRequest,rejectFriendRequest,accessRequest,getFriend, getFriendRequests}