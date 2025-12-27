import { useEffect, useState } from 'react'
import Client from '../services/api'
import { useNavigate } from 'react-router-dom'
import { FaRandom, FaArrowLeft } from 'react-icons/fa'
import {
  Box,
  HStack,
  Text,
  Image,
  Stack,
  Card,
  Heading,
  IconButton
} from '@chakra-ui/react'
const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  // random recipe function
  const handleRandomRecipe = async () => {
    try {
      //axios call to get random recipe
      const response = await Client.get('/recipe/random')
      //check if the response.data.meals (array of recipes) exist then take it from the array otherwise set the random as null
      const random = response.data.meals ? response.data.meals[0] : null
      setRandomRecipe(random) //set the Random Recipe
    } catch (error) {
      setError('No recipe found. Please try again!')
    }
  }

  useEffect(() => {
    handleRandomRecipe()
  }, [])

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      <HStack mb={6} justify="space-between" align="center">
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

        <IconButton
          onClick={handleRandomRecipe}
          aria-label="Get random recipe"
          borderRadius="full"
          bg="#F297BD"
          color="white"
          boxShadow="md"
          _hover={{ bg: 'gray.800', transform: 'rotate(90deg)' }}
          transition="all 0.2s ease"
        >
          <FaRandom size={16} />
        </IconButton>
      </HStack>

      {randomRecipe && (
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
                  {randomRecipe.strMeal}
                </Heading>
                <Text color="gray.600">{randomRecipe.strCategory}</Text>
              </Box>

              <Image
                src={randomRecipe.strMealThumb}
                alt={randomRecipe.strMeal}
                borderRadius="lg"
                objectFit="cover"
                maxH="400px"
              />

              <Box
                p={4}
                bg="gray.50"
                borderRadius="lg"
                maxH="180px"
                overflowY="auto"
              >
                <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                  {randomRecipe.strInstructions}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Ingredients
                </Text>

                <Stack direction="row" flexWrap="wrap" gap={2}>
                  {Object.keys(randomRecipe)
                    .filter(
                      (key) =>
                        key.startsWith('strIngredient') &&
                        randomRecipe[key]?.trim()
                    )
                    .map((key, index) => (
                      <Box
                        key={index}
                        px={3}
                        py={1}
                        bg="gray.100"
                        borderRadius="full"
                        fontSize="sm"
                      >
                        {randomRecipe[key]}
                      </Box>
                    ))}
                </Stack>
              </Box>

              {getYoutubeId(randomRecipe.strYoutube) && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Watch the recipe
                  </Text>

                  <Box
                    as="iframe"
                    w="100%"
                    h="400px"
                    borderRadius="lg"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      randomRecipe.strYoutube
                    )}`}
                    allow="autoplay; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  )
}

export default RandomRecipe
