import prisma from "../utils/prisma.js";
 
 //Options
const createOption = async (req, res)=>{
    const {optionText, isCorrect, questionId} = req.body;
    if (!optionText || isCorrect.length===0 || !questionId) {
      return res.status(400).json({ error: "OptionText,isCorrect and questionId fields are required" });
    }
  
    try {
    
      const newOption = await prisma.option.create({
        data:{
          optionText,
          isCorrect,
          questionId,
        },
        include:{
          question:true
        }
      })
    
      if(!newOption){
        res.status(400).json({error:"Could not create option"})
      }
      res.status(201).json({message:"Option created", data: newOption})
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "An error occurred while creating the option" ,error:error.message});
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
        return res.status(400).json({error: "unable to get option" })
      }
      return res.status(200).json({data: option, message:"option retrieved successfully"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while retrieving the option" });
    }
  }
  
const getOptionsByQuestion = async(req, res)=>{
    const {questionId} = req.params;
    if(!questionId){
      return res.status(400).json({error: "question id is required"})
    }
    try {
      const options = await prisma.option.findMany({
        where: {
          questionId,
        }
      })
      if(options.length === 0){
        return res.status(400).json({error: "unable to get options"})
      }
      return res.status(200).json({data: options, message: "options fetched successfully"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while retrieving options" });
    }
  }
  
const updateOption = async(req, res) =>{
    const {id}= req.params
    const {optionText, isCorrect} = req.body;
    if(!id){
      return res.status(400).json({error: "id is required"})
    }
    try {
      const option = await prisma.option.findUnique({
        where: {
          id
        }
      })
      if(!option){
        return res.status(400).json({error: "option not found"})
      }
     
      const updatedOption = await prisma.option.update({
        where: {
          id
        },
        data:{
          optionText, isCorrect
        }
      })
      if(!updatedOption){
        return res.status(400).json({error: "unable to update option"})
      }
      return res.status(201).json({data: updatedOption, message: "option updated"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while updating options" });
    }
  
  }
  
const deleteOption = async (req, res)=>{
    const {id}= req.params;
    if(!id){
      return res.status(400).json({error: "id is required"})
    }
    try {
      const option = await prisma.option.findUnique({
        where: {
          id
        }
      })
      if(!option){
        return res.status(400).json({error: "option does not exist"})
      }    
      await prisma.option.delete({
        where: {id}
      })    
      return res.status(200).json({message: "option deleted successfully"})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while deleting the option" });
    }
  }

  export {createOption, getOptionById, getOptionsByQuestion, deleteOption, updateOption}