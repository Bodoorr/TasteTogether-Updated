import { useState } from 'react'
import Client from '../services/api'
import { useNavigate } from 'react-router-dom'
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

const NewRecipe = ({ addRecipe }) => {
  let navigate = useNavigate()

  const initialState = {
    recipeName: '',
    recipeDescription: '',
    recipeInstruction: '',
    recipeIngredient: '',
    recipeCategory: '',
    recipeImage: ''
  }
  const [recipeState, setRecipeState] = useState(initialState)

  const handleChange = (event) => {
    const { id, value, files } = event.target
    setRecipeState({
      ...recipeState,
      [id]: files ? files[0] : value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('recipeName', recipeState.recipeName)
    formData.append('recipeImage', recipeState.recipeImage)
    formData.append('recipeDescription', recipeState.recipeDescription)
    formData.append('recipeInstruction', recipeState.recipeInstruction)
    formData.append('recipeIngredient', recipeState.recipeIngredient)
    formData.append('recipeCategory', recipeState.recipeCategory)

    const token = localStorage.getItem('token')

    const response = await Client.post(
      '/recipe/db',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    )

    const newRecipe = response.data
    addRecipe(newRecipe)
    setRecipeState(initialState)
    navigate('/user/recipes')
  }

  return (
    <Center minH="95vh" px={2}>
      <Box
        maxW="820px"
        maxH="90vh"  
        w="100%"
        p={5}
        borderRadius="xl"
        boxShadow="sm"
        bg="white"
      >
        <Stack spacing={5}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Add Recipe
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Fill in the details and upload a photo.
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Recipe Name
                </Text>
                <Input
                  id="recipeName"
                  value={recipeState.recipeName}
                  onChange={handleChange}
                  placeholder="e.g. Chicken Alfredo"
                  borderRadius="lg"
                  size="md"
                  bg="gray.50"
                  borderColor="gray.200"
                  required
                  _focus={{
                    borderColor: 'teal.400',
                    boxShadow: '0 0 0 1px teal'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
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
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Description
                </Text>
                <Box
                  as="textarea"
                  id="recipeDescription"
                  value={recipeState.recipeDescription}
                  onChange={handleChange}
                  placeholder="Short description about the recipe..."
                  required
                  style={{
                    width: '100%',
                    minHeight: '70px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Instructions
                </Text>
                <Box
                  as="textarea"
                  id="recipeInstruction"
                  value={recipeState.recipeInstruction}
                  onChange={handleChange}
                  placeholder="Write the steps..."
                  required
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Ingredients
                </Text>
                <Box
                  as="textarea"
                  id="recipeIngredient"
                  value={recipeState.recipeIngredient}
                  onChange={handleChange}
                  placeholder="Ingredients separated by commas (e.g. flour, milk, eggs)"
                  required
                  style={{
                    width: '100%',
                    minHeight: '70px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F7FAFC'
                  }}
                />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.800"
                  mb={2}
                >
                  Recipe Image
                </Text>

                <HStack spacing={3}>
                  <Button
                    as="label"
                    htmlFor="recipeImage"
                    variant="outline"
                    borderRadius="full"
                    size="sm"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    Choose Image
                  </Button>

                  <Text fontSize="sm" color="gray.600">
                    {recipeState.recipeImage?.name || 'No file selected'}
                  </Text>
                </HStack>

                <Input
                  id="recipeImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  display="none"
                  required
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
                Create Recipe
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}

export default NewRecipe
