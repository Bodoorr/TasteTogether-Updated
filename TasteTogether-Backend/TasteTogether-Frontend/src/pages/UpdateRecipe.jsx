import { useState, useEffect } from 'react'
import Client from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  HStack,
  Text,
  Input,
  Stack,
  Button,
  Center
} from '@chakra-ui/react'
//category list same as the one in the api
const categoriesList = [
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
  'Breakfast',
  'Goat'
]

const UpdateRecipe = ({ addRecipe }) => {
  const navigate = useNavigate()
  const { recipe_id } = useParams() //get the recipe id from URL parameters

  //the initial state of the form fields
  const initialState = {
    recipeName: '',
    recipeDescription: '',
    recipeInstruction: '',
    recipeIngredient: '',
    recipeCategory: '',
    recipeImage: null //in case the user uploads a new image
  }

  //to hold the current recipe loaded from the database
  const [recipeState, setRecipeState] = useState(initialState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //fetch the recipe from the database
    const Recipe = async () => {
      try {
        //axios call to get the recipe in the database by id
        const response = await Client.get(
          `/recipe/db/${recipe_id}`
        )
        const recipe = response.data //return the full recipe

        //populate the form field with the existing recipe data
        setRecipeState({
          recipeName: recipe.recipeName || '',
          recipeDescription: recipe.recipeDescription || '',
          recipeInstruction: recipe.recipeInstruction || '',
          recipeIngredient: recipe.recipeIngredient || '',
          recipeCategory: recipe.recipeCategory || '',
          recipeImage: null // No existing image file, user can upload new
        })
        setLoading(false) // finish the loading
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
        setLoading(false)
      }
    }
    Recipe() //call the recipe function for the fetch recipes from the database
  }, [recipe_id])

  if (loading) return <p>Loading recipe data...</p>

  //handle the changes in any form field
  const handleChange = (event) => {
    const { id, value, files } = event.target
    setRecipeState({
      ...recipeState,
      [id]: files ? files[0] : value
    })
  }

  //handle the form submission to send the updated recipe data
  const handleSubmit = async (event) => {
    //prevent reloading the page
    event.preventDefault()

    //using formData to send multipart form data
    const formData = new FormData()

    //append the recipe fields from state to the form data
    formData.append('recipeName', recipeState.recipeName)
    formData.append('recipeDescription', recipeState.recipeDescription)
    formData.append('recipeInstruction', recipeState.recipeInstruction)
    formData.append('recipeIngredient', recipeState.recipeIngredient)
    formData.append('recipeCategory', recipeState.recipeCategory)

    //append the image file if the user uploads a new one
    if (recipeState.recipeImage) {
      formData.append('recipeImage', recipeState.recipeImage)
    }

    //define token for authentication
    const token = localStorage.getItem('token')

    try {
      //axios call to PUT the new updated recipe fields by id
      const response = await Client.put(
        `/recipe/db/${recipe_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      //save the response data in the updatedRecipe
      const updatedRecipe = response.data
      //add the updated response ( recipe fields) to the recipes
      addRecipe(updatedRecipe)
      //set the recipe state to initial state
      setRecipeState(initialState)
      //navigate to user recipes page
      navigate('/user/recipes')
    } catch (error) {
      console.error('Failed to update recipe:', error)
    }
  }

  return (
    <Center minH="95vh" px={4}>
      <Box
        maxW="900px"
        w="100%"
        maxH="85vh"
        overflowY="auto"
        p={5}
        borderRadius="xl"
        boxShadow="sm"
        bg="white"
      >
        <Stack spacing={5}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Update Recipe
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Edit your recipe details below.
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <Stack spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Recipe Name
                </Text>
                <Input
                  id="recipeName"
                  value={recipeState.recipeName}
                  onChange={handleChange}
                  borderRadius="lg"
                  bg="gray.50"
                  required
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Category
                </Text>
                <Box
                  as="select"
                  id="recipeCategory"
                  value={recipeState.recipeCategory}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoriesList.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Box>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Description
                </Text>
                <Box
                  as="textarea"
                  id="recipeDescription"
                  value={recipeState.recipeDescription}
                  onChange={handleChange}
                  required
                  style={{
                    minHeight: '70px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Instructions
                </Text>
                <Box
                  as="textarea"
                  id="recipeInstruction"
                  value={recipeState.recipeInstruction}
                  onChange={handleChange}
                  required
                  style={{
                    minHeight: '100px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Ingredients
                </Text>
                <Box
                  as="textarea"
                  id="recipeIngredient"
                  value={recipeState.recipeIngredient}
                  onChange={handleChange}
                  required
                  style={{
                    minHeight: '70px',
                    width: '100%',

                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Recipe Image
                </Text>

                <HStack spacing={3}>
                  <Button
                    as="label"
                    htmlFor="recipeImage"
                    size="sm"
                    variant="outline"
                    borderRadius="full"
                    cursor="pointer"
                  >
                    Choose Image
                  </Button>

                  <Text fontSize="sm" color="gray.600">
                    {recipeState.recipeImage?.name || 'Keep existing image'}
                  </Text>
                </HStack>

                <Input
                  id="recipeImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  display="none"
                />
              </Box>

              <Button
                type="submit"
                size="md"
                borderRadius="full"
                bg="gray.900"
                color="white"
                _hover={{ bg: 'gray.800' }}
                w="full"
                mt={2}
              >
                Update Recipe
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}

export default UpdateRecipe
