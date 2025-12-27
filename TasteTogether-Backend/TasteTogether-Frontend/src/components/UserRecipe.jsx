import { useEffect, useState } from 'react'
import Client from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { FaRandom } from 'react-icons/fa'
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Stack,
  Card,
  Heading,
  Button,
  IconButton,
  Spinner,
  Center,
  Avatar
} from '@chakra-ui/react'
const UserRecipe = ({ user, recipes, setRecipes }) => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token') // get token from localStorage for authentication

  // to fetch recipes from backend with auth token
  const Recipes = async () => {
    try {
      const response = await Client.get('/recipe/db', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(response.data || []) //set recipes to response data or empty array if theres no data
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([]) // clear recipes
    }
  }

  useEffect(() => {
    if (!user) {
      setLoading(true)
      setRecipes([]) // clear recipes if no user
      return
    }
    Recipes() // fetch recipes when user changes
    setLoading(false)
  }, [user, setRecipes, token])

  // navigate to add new recipe page
  const handleAddRecipe = () => {
    navigate('/recipes/new')
  }

  // delete a recipe by id, then update recipes state to remove it
  const handleDelete = async (id) => {
    try {
      await Client.delete(`/recipe/db/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(recipes.filter((recipe) => recipe._id !== id)) //remove the recipe with the matching id from the list
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  if (!user) {
    // show message if user is not signed in
    return (
      <div>
        <h3>Oops! You must be signed in to see your recipes!</h3>
        <button onClick={() => navigate('/signin')}>Sign In</button>
      </div>
    )
  }

  const currentUserId = localStorage.getItem('userId') // get current user id from the local storage

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.900">
          Users Recipes
        </Heading>

        <HStack spacing={3}>
          <Button
            onClick={handleAddRecipe}
            borderRadius="full"
            bg="#FF9D5C"
            color="white"
            _hover={{ bg: 'gray.800' }}
            size="sm"
          >
            Add Recipe
          </Button>

          <IconButton
            onClick={() => navigate('/recipes/random')}
            aria-label="Random user recipe"
            borderRadius="full"
            bg="#FF9D5C"
            color="white"
            boxShadow="sm"
            _hover={{ bg: 'gray.800', transform: 'rotate(90deg)' }}
            transition="all 0.2s ease"
            size="sm"
          >
            <FaRandom size={16} />
          </IconButton>
        </HStack>
      </HStack>

      {loading && (
        <Center py={16}>
          <VStack spacing={3}>
            <Spinner thickness="3px" speed="0.65s" />
            <Text color="gray.600" fontSize="sm">
              Loading recipes...
            </Text>
          </VStack>
        </Center>
      )}

      {!loading && recipes.length === 0 && (
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
              No recipes found
            </Text>
            <Text color="gray.600" fontSize="sm">
              Try adding some recipes to see them here.
            </Text>

            <Button
              mt={4}
              onClick={handleAddRecipe}
              borderRadius="full"
              bg="gray.900"
              color="white"
              _hover={{ bg: 'gray.800' }}
              size="sm"
            >
              Add your first recipe
            </Button>
          </Box>
        </Center>
      )}

      {!loading && recipes.length > 0 && (
        <Stack spacing={6} maxW="760px" mx="auto">
          {recipes.map((recipe) => (
            <Card.Root
              key={recipe._id}
              borderRadius="2xl"
              boxShadow="sm"
              overflow="hidden"
              bg="#f3cdb4db"
              _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.15s ease"
            >
              {recipe.recipeImage && (
                <Image
                  src={`http://localhost:3001/uploads/${recipe.recipeImage}`}
                  alt={recipe.recipeName}
                  w="100%"
                  h="240px"
                  objectFit="cover"
                />
              )}

              <Card.Body>
                <Stack spacing={4}>
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
                        {recipe.user?.username?.[0]?.toUpperCase() || 'U'}
                      </Avatar.Fallback>
                      {recipe.user?.image && (
                        <Avatar.Image
                          src={`http://localhost:3001/uploads/${recipe.user.image}`}
                          style={{ borderRadius: '50%' }}
                        />
                      )}
                    </Avatar.Root>

                    <Box>
                      <Text
                        fontWeight="semibold"
                        color="gray.900"
                        fontSize="sm"
                      >
                        {recipe.user?.username || 'Unknown User'}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {recipe.recipeCategory}
                      </Text>
                    </Box>
                  </HStack>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.900">
                      {recipe.recipeName}
                    </Text>

                    {recipe.recipeDescription && (
                      <Text color="gray.700" fontSize="sm" mt={1} noOfLines={3}>
                        {recipe.recipeDescription}
                      </Text>
                    )}
                  </Box>

                  {recipe.recipeIngredient && (
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
                        {String(recipe.recipeIngredient)
                          .split(',')
                          .map((ing) => ing.trim())
                          .filter(Boolean)
                          .slice(0, 10)
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

                        {String(recipe.recipeIngredient)
                          .split(',')
                          .filter(Boolean).length > 10 && (
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

                  {recipe.recipeInstruction && (
                    <Box
                      p={4}
                      bg="#efded3e7"
                      borderRadius="lg"
                      maxH="160px"
                      overflowY="auto"
                    >
                      <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                        {recipe.recipeInstruction}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Card.Body>

              {(recipe.user?._id || recipe.user) === currentUserId && (
                <Card.Footer justifyContent="flex-end" gap={2}>
                  <Button
                    as={Link}
                    to={`/update/${recipe._id}`}
                    variant="outline"
                    borderRadius="full"
                    size="sm"
                    bg="#fa9f62ff"
                    border="#fa9f62ff"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(recipe._id)}
                    borderRadius="full"
                    size="sm"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: 'red.600' }}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              )}
            </Card.Root>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default UserRecipe
