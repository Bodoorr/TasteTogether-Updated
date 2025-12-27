import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import {
  Box,
  HStack,
  Text,
  Image,
  Stack,
  Card,
  Heading
} from '@chakra-ui/react'
const RecipeDetails = () => {
  const navigate = useNavigate()

  //extract the id from the url
  const { id } = useParams()
  //store the recipe data
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)

  // to fetch recipe details when it mounts or id changes
  useEffect(() => {
    //fetch recipe by id
    const Recipe = async () => {
      try {
        //axios call to get the recipe by id
        const response = await axios.get(`http://localhost:3001/recipe/${id}`)

        //check if data exists and contain at least one meal
        if (response.data.meals && response.data.meals.length > 0) {
          setRecipe(response.data.meals[0]) //set the recipe
        } else {
          setError('Recipe not found.') //if its not found set the error
        }
      } catch (error) {
        setError('Failed to fetch recipe.') //if its not found set the error
      }
    }
    Recipe() //call the recipe function that fetch the recipe
  }, [id])

  if (!recipe) return <div>Loading recipe...</div>

  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith('strIngredient') && recipe[key]?.trim())
    .map((key) => recipe[key].trim())

  //for the recipe youtube video
  const getYoutubeId = (url) => {
    try {
      if (!url) return null //return null if no URL exist
      const videoUrl = new URL(url) //parse URL to string and gives an object
      return videoUrl.searchParams.get('v') //search for the query parameter which is here v
    } catch {
      return null
    }
  }
  //get the youtube video id from the recipe link
  const videoId = getYoutubeId(recipe.strYoutube)

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      <HStack justify="space-between" align="center" mb={6}>
        <Box
          as="button"
          onClick={() => navigate('/recipes')}
          display="inline-flex"
          alignItems="center"
          gap="8px"
          color="gray.700"
          _hover={{ color: 'gray.900' }}
          cursor="pointer"
        >
          <FaArrowLeft size={14} />
          <Text fontSize="sm">Back</Text>
        </Box>
      </HStack>

      <Card.Root
        maxW="900px"
        mx="auto"
        borderRadius="xl"
        boxShadow="md"
        bg="#ffaed0b7"
        overflow="hidden"
      >
        <Card.Body>
          <Stack spacing={5}>
            <Box>
              <Heading size="lg" color="gray.900">
                {recipe.strMeal}
              </Heading>
              <Text color="gray.600">Category: {recipe.strCategory}</Text>
            </Box>

            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              borderRadius="lg"
              objectFit="cover"
              maxH="420px"
              w="100%"
            />

            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              maxH="180px"
              overflowY="auto"
            >
              <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                {recipe.strInstructions}
              </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={2} color="gray.900">
                Ingredients
              </Text>

              <Stack direction="row" flexWrap="wrap" gap={2}>
                {ingredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    px={3}
                    py={1}
                    bg="gray.100"
                    borderRadius="full"
                    fontSize="sm"
                    color="gray.800"
                  >
                    {ingredient}
                  </Box>
                ))}
              </Stack>
            </Box>

            {videoId && (
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.900">
                  Watch the recipe
                </Text>

                <Box
                  as="iframe"
                  w="100%"
                  h="400px"
                  borderRadius="lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Recipe Video"
                  allow="autoplay; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
export default RecipeDetails
