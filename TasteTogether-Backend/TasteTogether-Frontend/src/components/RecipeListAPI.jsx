import { useState, useEffect } from 'react'
import Client from '../services/api'
import RecipeSearchBar from './RecipeSearchBar'
import { Link } from 'react-router-dom'
import { FaRandom } from 'react-icons/fa'
import {
  Box,
  HStack,
  Text,
  Image,
  Stack,
  Card,
  Heading,
  Button,
  IconButton
} from '@chakra-ui/react'
const RecipeListAPI = () => {
  const [recipes, setRecipes] = useState(null)
  const [error, setError] = useState(null)

  //to preview all the recipes in the page
  useEffect(() => {
    Recipes()
  }, [])

  //to get the recipes from the api
  const Recipes = async () => {
    try {
      const response = await Client.get('/recipe')
      setRecipes(response.data)
    } catch (error) {
      setError('Failed to fetch recipes')
    }
  }

  //for the search recipe
  const handleSearch = async (search) => {
    if (!search.trim()) {
      //trim to remove any spaces
      Recipes()
    }

    //the result of the search bar
    try {
      const response = await Client.get(
        `/recipe/search/${search}`
      )
      if (response.data.meals) {
        setRecipes(response.data.meals)
      } else {
        setRecipes([]) // No results
      }
    } catch (error) {
      setError('Failed to search recipes') //if theres an error
      setRecipes([])
    }
  }
  if (recipes === null) return <div></div>
  if (recipes.length === 0) return <div>No recipes found.</div>

  return (
    <Box px={{ base: 4, md: 8 }} py={6} pl={{ base: '72px', md: '96px' }}>
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.900">
          Recipes
        </Heading>

        <IconButton
          as={Link}
          to="/random"
          aria-label="Get random recipe"
          borderRadius="full"
          bg="#F297BD"
          color="white"
          boxShadow="md"
          _hover={{ bg: 'gray.800', transform: 'rotate(90deg)' }}
          transition="all 0.2s ease"
        >
          <FaRandom size={18} />
        </IconButton>
      </HStack>

      <Box mb={6}>
        <RecipeSearchBar onSearch={handleSearch} />
      </Box>

      <Stack spacing={5}>
        {recipes.map((recipe) => {
          const ingredients = Object.keys(recipe)
            .filter(
              (key) => key.startsWith('strIngredient') && recipe[key]?.trim()
            )
            .map((key) => recipe[key].trim())

          return (
            <Card.Root
              key={recipe.idMeal}
              borderRadius="xl"
              boxShadow="sm"
              overflow="hidden"
              bg="#ffaed0b7"
              _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.15s ease"
            >
              <Card.Body>
                <HStack spacing={4} align="center">
                  <Box as={Link} to={`/recipe/${recipe.idMeal}`} flexShrink={0}>
                    <Image
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      w={{ base: '90px', md: '130px' }}
                      h={{ base: '90px', md: '130px' }}
                      objectFit="cover"
                      borderRadius="lg"
                    />
                  </Box>

                  <Box flex="1">
                    <HStack justify="space-between" align="start">
                      <Box>
                        <Text
                          as={Link}
                          to={`/recipe/${recipe.idMeal}`}
                          fontSize="lg"
                          fontWeight="bold"
                          color="gray.900"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {recipe.strMeal}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {recipe.strCategory}
                        </Text>
                      </Box>

                      <Button
                        as={Link}
                        to={`/recipe/${recipe.idMeal}`}
                        size="sm"
                        borderRadius="full"
                        bg="#d2246dff"
                        color="white"
                        _hover={{ bg: 'gray.800' }}
                      >
                        View
                      </Button>
                    </HStack>

                    <Box
                      mt={3}
                      p={3}
                      bg="#f6d7e48f"
                      borderRadius="lg"
                      maxH="110px"
                      overflowY="auto"
                    >
                      <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                        {recipe.strInstructions}
                      </Text>
                    </Box>

                    <Box mt={3}>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.900"
                        mb={2}
                      >
                        Ingredients
                      </Text>

                      <Stack direction="row" flexWrap="wrap" gap={2}>
                        {ingredients.slice(0, 12).map((ingredient, index) => (
                          <Box
                            key={index}
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="gray.100"
                            color="gray.800"
                            fontSize="xs"
                          >
                            {ingredient}
                          </Box>
                        ))}
                        {ingredients.length > 12 && (
                          <Box
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="gray.200"
                            color="gray.700"
                            fontSize="xs"
                          >
                            +{ingredients.length - 12} more
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </HStack>
              </Card.Body>
            </Card.Root>
          )
        })}
      </Stack>
    </Box>
  )
}

export default RecipeListAPI
