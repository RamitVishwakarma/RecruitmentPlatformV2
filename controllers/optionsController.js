import prisma from "../utils/prisma.js";
 
 //Options
const createOption = async (req, res)=>{
    const {id, optionsText, isCorrect, questionId} = req.body;
    if (!id || !optionsText || questionId === undefined) {
      return res.status(400).json({ error: "ID, optionsText, and questionId are required" });
    }
  
    try {
      const existingOption = await prisma.option.findUnique({
        where:{
          id: id,
        }
      })
    
      if(existingOption){
        res.status(400).json({error:"option already exists"})
      }
    
      const newOption = await prisma.option.create({
        data:{
          id,
          optionsText,
          isCorrect,
          questionId
        }
      })
    
      if(!newOption){
        res.status(400).json({error:"could not create option", data: newOption})
      }
      res.status(201).json({message:"option created"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "An error occurred while creating the option" });
    }
  
  }
  
const getOptionById = async(req, res)=>{
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
  
    try {
      const option = await prisma.option.findUnique({
        where: {
          id: id,
        }
      })
    
      if(!option){
        return res.status(400).json({error: "unable to get option"
        })
      }
      return res.status(200).json({data: option, message:"option retrieved successfully"
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while retrieving the option" });
    }
  }
  
const getOptionsByQuestion = async(req, res)=>{
    const {questionId} = req.body;
    if(!questionId){
      return res.status(400).json({error: "question id is required"
      })
    }
    try {
      const options = await prisma.option.findMany({
        where: {
          questionId,
        }
      })
      if(options.length === 0){
        return res.status(400).json({error: "unable to get options"
        })
      }
      return res.status(200).json({data: options, message: "options fetched successfully"
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while retrieving options" });
    }
  }
  
const updateOption = async(req, res) =>{
    const {id}= req.params
    if(!id){
      return res.status(400).json({error: "id is required"
      })
    }
    try {
      const option = await prisma.option.findUnique({
        where: {
          id
        }
      })
      if(!option){
        return res.status(400).json({error: "option not found"
        })
      }
      const {optionsText, isCorrect} = req.body;
      const updatedOption = await prisma.option.update({
        where: {
          id
        },
        data:{
          optionsText, isCorrect
        }
      })
      if(!updatedOption){
        return res.status(400).json({error: "unable to update option"
        })
      }
      return res.status(201).json({data: updatedOption, message: "option updated"
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while updating options" });
    }
  
  }
  
const deleteOption = async (req, res)=>{
    const {id}= req.params;
    if(!id){
      return res.status(400).json({error: "id is required"
      })
    }
    try {
      const option = await prisma.option.findUnique({
        where: {
          id
        }
      })
      if(!option){
        return res.status(400).json({error: "option does not exist"
        })
      }    
      await prisma.option.delete({
        where: {id}
      })    
      return res.status(200).json({message: "option deleted successfully"
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while deleting the option" });
    }
  }

  export {createOption, getOptionById, getOptionsByQuestion, deleteOption, updateOption}