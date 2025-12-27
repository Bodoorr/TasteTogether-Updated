import { useState } from 'react'
import { Input, Box, HStack, Button, } from '@chakra-ui/react'

const RecipeSearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault() //prevent page reload on form
    onSearch(search) //onSearch handleSearch function from RecipeListAPI
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%" maxW="420px" mx="auto">
      <HStack mt={6} spacing={3} align="center">
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          borderRadius="full"
          size="md"
          px={4}
          boxShadow="sm"
          _focus={{
            borderColor: 'teal.400',
            boxShadow: '0 0 0 1px teal'
          }}
        />

        <Button
          type="submit"
          borderRadius="full"
          px={6}
          bg="#f07aabff"
          color="white"
          boxShadow="sm"
          _hover={{ bg: 'gray.800' }}
        >
          Search
        </Button>
      </HStack>
    </Box>
  )
}

export default RecipeSearchBar
