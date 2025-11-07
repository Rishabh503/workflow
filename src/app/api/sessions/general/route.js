import { connectDB } from "@/lib/db";
import Session from "@/models/sessionModel";
import Student from "@/models/studentModel";
import { currentUser } from "@clerk/nextjs/server";
export async function POST(req){
    await connectDB();
    try {
        const reqBody=await req.json()
        const {date,startTime,endTime}= reqBody;
        console.log(reqBody);
        const clerkUser = await currentUser();
         if (!clerkUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

    const thisStudent = await Student.findOne({ clerkId: clerkUser.id });
if(!thisStudent) throw new Error("no studenet fid")

    const newSession=await Session.create({
        student:thisStudent,
        date,
        startTime,
        endTime
    })
    if(!newSession) throw new Error("failed cresting the session")
        thisStudent.sessions.push(newSession)
    await thisStudent.save();

 return new Response(JSON.stringify({ session: newSession }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error while creating sessiion:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  await connectDB();
  
  try {
    const { id } = params;
    
    // Verify user is authenticated
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    // Find the student
    const thisStudent = await Student.findOne({ clerkId: clerkUser.id });
    if (!thisStudent) {
      return new Response(
        JSON.stringify({ error: "Student not found" }), 
        { status: 404 }
      );
    }

    // Delete the session
    const deletedSession = await Session.findByIdAndDelete(id);
    if (!deletedSession) {
      return new Response(
        JSON.stringify({ error: "Session not found" }), 
        { status: 404 }
      );
    }

    // Remove session reference from student's sessions array
    thisStudent.sessions = thisStudent.sessions.filter(
      (sessionId) => sessionId.toString() !== id
    );
    await thisStudent.save();

    return new Response(
      JSON.stringify({ 
        message: "Session deleted successfully",
        deletedSession 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}