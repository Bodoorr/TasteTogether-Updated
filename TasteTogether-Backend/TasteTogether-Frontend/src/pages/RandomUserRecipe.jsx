import { useState, useEffect } from 'react'
import Client from '../services/api'
import { useNavigate } from 'react-router-dom'
import { FaRandom, FaArrowLeft } from 'react-icons/fa'
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Stack,
  Card,
  Button,
  Spinner,
  IconButton,
  Center,
  Avatar
} from '@chakra-ui/react'
const RandomUserRecipe = () => {
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [randomRecipe, setRandomRecipe] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const Recipes = async () => {
      try {
        const response = await Client.get('/recipe/db', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data || []) {
          setLoading(true)
          setRecipes(response.data)
          if (response.data.length > 0) {
            RandomRecipe(response.data)
          }
        } else {
          setRecipes([])
          setRandomRecipe(null)
        }
      } catch (error) {
        setRecipes([])
        setRandomRecipe(null)
        setError('Failed to fetch recipes.')
      }
    }
    Recipes()
    setLoading(false)
  }, [token])

  const RandomRecipe = (recipesList = recipes) => {
    if (recipesList.length === 0) {
      setRandomRecipe(null)
      return
    }
    const randomIndex = Math.floor(Math.random() * recipesList.length)
    setRandomRecipe(recipesList[randomIndex])
  }

  if (!token) {
    return (
      <div>
        <h3>You must be signed in to view your recipes!</h3>
        <button onClick={() => navigate('/signin')}>Sign In</button>
      </div>
    )
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      <HStack justify="space-between" align="center" mb={6}>
        <Box
          as="button"
          onClick={() => navigate('/user/recipes')}
          display="inline-flex"
          alignItems="center"
          gap="8px"
          color="gray.700"
          cursor="pointer"
          _hover={{ color: 'gray.900' }}
        >
          <FaArrowLeft size={16} />
          <Text fontSize="sm">Back to All Recipes</Text>
        </Box>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            RandomRecipe()
          }}
          aria-label="Random recipe"
          borderRadius="full"
          bg="#FF9D5C"
          color="white"
          boxShadow="sm"
          _hover={{ bg: 'gray.800' }}
          size="sm"
          isLoading={loading}
        >
          <FaRandom size={14} />
        </IconButton>
      </HStack>

      {randomRecipe ? (
        <Card.Root
          maxW="760px"
          mx="auto"
          borderRadius="2xl"
          boxShadow="md"
          bg="#f3cdb4db"
          overflow="hidden"
        >
          {randomRecipe.recipeImage && (
            <Image
              src={`http://localhost:3001/uploads/${randomRecipe.recipeImage}`}
              alt={randomRecipe.recipeName}
              w="100%"
              h="260px"
              objectFit="cover"
            />
          )}

          <Card.Body>
            <Stack spacing={4}>
              {randomRecipe.user && (
                <HStack spacing={3}>
                  <Avatar.Root
                    size="sm"
                    shape="full"
                    style={{ borderRadius: '50%', overflow: 'hidden' }}
                  >
                    <Avatar.Fallback
                      bg="gray.300"
                      style={{ borderRadius: '50%' }}
                    >
                      {randomRecipe.user?.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar.Fallback>

                    {randomRecipe.user?.image && (
                      <Avatar.Image
                        src={`http://localhost:3001/uploads/${randomRecipe.user.image}`}
                        style={{ borderRadius: '50%' }}
                      />
                    )}
                  </Avatar.Root>

                  <Box>
                    <Text fontWeight="semibold" color="gray.900" fontSize="sm">
                      {randomRecipe.user?.username || 'Unknown User'}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {randomRecipe.recipeCategory}
                    </Text>
                  </Box>
                </HStack>
              )}

              <Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">
                  {randomRecipe.recipeName}
                </Text>

                {randomRecipe.recipeDescription && (
                  <Text color="gray.700" fontSize="sm" mt={1}>
                    {randomRecipe.recipeDescription}
                  </Text>
                )}
              </Box>

              {randomRecipe.recipeIngredient && (
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontSize="sm"
                    mb={2}
                    color="gray.900"
                  >
                    Ingredients
                  </Text>

                  <Stack direction="row" flexWrap="wrap" gap={2}>
                    {String(randomRecipe.recipeIngredient)
                      .split(',')
                      .map((ing) => ing.trim())
                      .filter(Boolean)
                      .slice(0, 12)
                      .map((ing, idx) => (
                        <Box
                          key={idx}
                          px={3}
                          py={1}
                          bg="#efded3e7"
                          borderRadius="full"
                          fontSize="xs"
                          color="gray.800"
                        >
                          {ing}
                        </Box>
                      ))}

                    {String(randomRecipe.recipeIngredient)
                      .split(',')
                      .map((ing) => ing.trim())
                      .filter(Boolean).length > 12 && (
                      <Box
                        px={3}
                        py={1}
                        bg="#efded3e7"
                        borderRadius="full"
                        fontSize="xs"
                        color="gray.700"
                      >
                        +more
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}

              {randomRecipe.recipeInstruction && (
                <Box
                  p={4}
                  bg="#efded3e7"
                  borderRadius="lg"
                  maxH="180px"
                  overflowY="auto"
                >
                  <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                    {randomRecipe.recipeInstruction}
                  </Text>
                </Box>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      ) : loading ? (
        <Center py={16}>
          <VStack spacing={3}>
            <Spinner thickness="3px" speed="0.65s" />
            <Text color="gray.600" fontSize="sm">
              Getting a random recipe...
            </Text>
          </VStack>
        </Center>
      ) : (
        <Center py={16}>
          <Box
            w="100%"
            maxW="520px"
            p={8}
            borderRadius="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            textAlign="center"
          >
            <Box
              mx="auto"
              w="52px"
              h="52px"
              borderRadius="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <Text fontSize="22px" color="gray.700">
                🍽️
              </Text>
            </Box>

            <Text fontWeight="semibold" color="gray.900" mb={1}>
              No recipes available
            </Text>
            <Text color="gray.600" fontSize="sm">
              Please add some recipes first!
            </Text>

            <Button
              mt={4}
              onClick={() => navigate('/user/recipes')}
              borderRadius="full"
              bg="gray.900"
              color="white"
              _hover={{ bg: 'gray.800' }}
              size="sm"
            >
              Back to All Recipes
            </Button>
          </Box>
        </Center>
      )}
    </Box>
  )
}

export default RandomUserRecipe
