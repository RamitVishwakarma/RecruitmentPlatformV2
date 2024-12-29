import prisma from "../utils/prisma.js";

//Questions
const createQuestion = async(req, res)=>{
    const {questionShortDesc, questionLongDesc, aptitudeId, options} = req.body;
  
    if (!questionShortDesc || !questionLongDesc || !aptitudeId) {
      return res.status(400).json({error: "All fields are required" });
    }
  
    try {
     
      const newQuestion = await prisma.question.create({
        data: {
          questionShortDesc: questionShortDesc,
          questionLongDesc,
          aptitudeId: aptitudeId,
           options: {
              create: options
            },
        },
        include:{
          options: true,
          aptitude:true
        }
      })
      return res.status(201).json({data:newQuestion, message: "Question created successfully"})

    } catch (error) {  
      return res.status(500).json({message: "An error occurred while creating the question",error:error.message });
    }
  }
  
const getQuestionById = async(req, res)=>{
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
  
    try {
      const question = await prisma.question.findUnique({
        where: {
          id: id,
        },
        include:{
          options: true
        }
      })
    
      if(!question){
        return res.status(400).json({error: "Unable to get question"})
      }
      return res.status(200).json({message: "Question retrieved successfully", data: question })
    } catch (error) {
      return res.status(500).json({message: "An error occurred while retrieving the question" ,error:error.message});
    }
  }
  
const getQuestionsByAptitude = async(req, res) =>{
    const {aptitudeId} = req.params;
    if(!aptitudeId){
      return res.status(400).json({error: "Aptitude id is required"})
    }
    
    try {
      const questions = await prisma.question.findMany({
        where: {
          aptitudeId,
        },
        include: {
          options: true,
        }
      })
      if(questions.length === 0){
        return res.status(400).json({message: "Unable to get question",error:error.message})
      }
      return res.status(200).json({message: "Questions retrieved successfully", data: questions})
    } catch (error) {
      
      return res.status(500).json({
        message: "An error occurred while retrieving questions",error:error.message});
    }
  }
  
const getAllQuestions = async (req, res)=>{
    try {
      const questions = await prisma.question.findMany({
        include: {options: true}
      })
      if(questions.length === 0){
        return res.status(400).json({error: "Unable to get question"})
      }
      return res.status(200).json({message: "Questions retrieved successfully", data: questions})
    } catch (error) {    
      return res.status(500).json({
        message: "An error occurred while retrieving questions",error:error.message});
    }
  }
  
const deleteQuestion = async(req, res)=>{
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const question = await prisma.question.findUnique({
        where: {
          id
        }
      })
    
      if(!question){
        return res.status(400).json({error: "Question does not exist"})
      }
      const deletedQuestion = await prisma.question.delete({
        where :{
          id
        }
      })
      if(!deletedQuestion){
        return res.status(400).json({error: "Unable to delete question"})
      }
      return res.status(200).json({message: "Successfully  deleted question"})
    } catch (error) {
      return res.status(500).json({
      message: "An error occurred while deleting questions",error:error.message});
    }
  }
  
const updateQuestion = async(req, res)=>{
    const {id} = req.params;
    const {questionLongDesc, questionShortDesc, aptitudeId} = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const question = await prisma.question.findUnique({
        where: {
          id
        }
      })
    
      if(!question){
        return res.status(400).json({error: "Question does not exist"})
      }
     
    
      const updatedQuestion = await prisma.question.update({
        where: {id},
        data:{
          questionLongDesc,
          questionShortDesc,
           aptitudeId
        }
      })
    
      if(!updatedQuestion){
        return res.status(400).json({error:"Unable to update question", data: updatedQuestion})
      }
      return res.status(201).json({message:"Updated successfully"}) 
    } catch (error) {  
      return res.status(500).json({
      message: "An error occurred while updating questions",error:error.message})
    }
  }
  
 
  
  export {createQuestion, getAllQuestions, getQuestionById, getQuestionsByAptitude, updateQuestion, deleteQuestion};