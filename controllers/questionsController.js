import prisma from "../utils/prisma.js";

//Questions
const createQuestion = async(req, res)=>{
    const {id, questionShortDesc, questionLongDesc, aptitudeId, optionsText} = req.body;
    //optionsText will be an array of all the texts like ["a", "b"]
  
    if (!id || !questionShortDesc || !questionLongDesc || !aptitudeId || !optionsText || !Array.isArray(optionsText)) {
      return res.status(400).json({error: "All fields are required and optionsText must be an array." });
    }
  
    try {
      const findQuestion = await prisma.question.findUnique({
        where: {
          id: id
        }
      })
    
      if(findQuestion){
        return res.status(400).json({error: "question already exists"})
      }
    
      const newQuestion = await prisma.question.create({
        data: {
          id,
          questionShortDesc: questionShortDesc,
          questionLongDesc,
          aptitudeId: aptitudeId,
           options: {
              create: optionsText.map(option => ({ text: option })),
            },
        },
        include:{
          options: true
        }
      })
    
      return res.status(201).json({data:newQuestion, message: "question created successfully"})

    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "An error occurred while creating the question" });
      
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
        return res.status(400).json({error: "unable to get question"
        })
      }
      return res.status(200).json({message: "question retrieved successfully", data: question
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "An error occurred while retrieving the question" });
    }
  }
  
const getQuestionsByAptitude = async(req, res) =>{
    const {aptitudeId} = req.body;
    if(!aptitudeId){
      return res.status(400).json({error: "aptitude id is required"
      })
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
        return res.status(400).json({error: "unable to get question"
        })
      }
      return res.status(200).json({message: "questions retrieved successfully", data: questions
      })
    } catch (error) {
      console.error(error);
      
      return res.status(500).json({
        error: "An error occurred while retrieving questions",
      });
    }
  }
  
const getAllQuestions = async (req, res)=>{
    try {
      const questions = await prisma.question.findMany({
        include: {options: true}
      })
      // include: {options: {select:{
      // optionText: true, isCorrect: true}}}
      if(questions.length === 0){
        return res.status(400).json({error: "unable to get question"
        })
      }
      return res.status(200).json({message: "questions retrieved successfully", data: questions
      })
    } catch (error) {
      console.error(error);    
      return res.status(500).json({
        error: "An error occurred while retrieving questions",
      });
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
        return res.status(400).json({error: "question does not exist"
        })
      }
      const deletedQuestion = await prisma.question.delete({
        where :{
          id
        }
      })
      if(!deletedQuestion){
        return res.status(400).json({error: "unable to delete question"
        })
      }
      return res.status(200).json({message: "successfully  deleted question"
      })
    } catch (error) {
      console.error(error);    
      return res.status(500).json({
       error: "An error occurred while deleting questions",
      });
    }
  }
  
const updateQuestion = async(req, res)=>{
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
        return res.status(400).json({error: "question does not exist"
        })
      }
      const {questionLongDesc, questionShortDesc, aptitudeId, options} = req.body;
    
      const updatedQuestion = await prisma.question.update({
        where: {id},
        data:{
          questionLongDesc,
          questionShortDesc, aptitudeId, options
        }
      })
    
      if(!updatedQuestion){
        return res.status(400).json({error:"unable to update question", data: updatedQuestion
        })
      }
      return res.status(201).json({message:"updated successfully"
      }) 
    } catch (error) {
      console.error(error);    
      return res.status(500).json({
        error: "An error occurred while updating questions",})
    }
  }
  
 
  
  export {createQuestion, getAllQuestions, getQuestionById, getQuestionsByAptitude, updateQuestion, deleteQuestion};