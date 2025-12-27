import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  Stack,
  Box,
  Heading,
  Text,
  Input
} from '@chakra-ui/react'
import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const RestuarantPost = ({ restaurants }) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const seen = new Set()
  const uniqueRestaurants = restaurants.filter((restaurant) => {
    const name = restaurant.fields.name
    const subtype = restaurant.fields.subtype
    const key = `${name}-${subtype}`.toLowerCase()

    if (seen.has(key)) {
      return false
    } else {
      seen.add(key)
      return true
    }
  })

  const filteredRestaurants = uniqueRestaurants.filter((restaurant) => {
    return restaurant.fields.name.toLowerCase().includes(search.toLowerCase())
  })

  const pageSize = 9
  const totalItems = filteredRestaurants.length

  const start = (page - 1) * pageSize
  const end = start + pageSize

  const currentRestaurants = filteredRestaurants.slice(start, end)
  return (
    <Box p={6} pl="80px">
      <Heading mb={6} fontSize="2xl">
        All Restaurants
      </Heading>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        mb={6}
        align="center"
      >
        <Input
          placeholder="Search Restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="400px"
          borderRadius="full"
          boxShadow="sm"
          isDisabled={currentRestaurants.length === 0}
          _focus={{
            borderColor: 'teal.400',
            boxShadow: '0 0 0 1px teal'
          }}
        />

        <Button
          bg="#99cce3ff"
          color="black"
          as={Link}
          to="/randomRestaurant"
          colorScheme="teal"
          borderRadius="full"
          px={6}
          isDisabled={currentRestaurants.length === 0}
        >
          Show Random Restaurant
        </Button>
      </Stack>

      {currentRestaurants.length === 0 ? (
        <Box
          mt={20}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="2xl"
          p={10}
          maxW="520px"
          mx="auto"
          textAlign="center"
          boxShadow="sm"
        >
          <Box fontSize="48px" mb={4}>
            🍽️
          </Box>

          <Heading size="md" mb={2}>
            Restaurants coming soon
          </Heading>

          <Text color="gray.600" mb={6}>
            We're currently fixing our restaurant data.
            <br />
            Stay tuned, delicious places are on the way!
          </Text>

          <Button
            variant="outline"
            borderRadius="full"
            bg="#99cce3ff"
            onClick={() => window.location.reload()}
          >
            Try again later
          </Button>
        </Box>
      ) : (
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={4}>
          {currentRestaurants.map((restaurant) => {
            const [longitude, latitude] = restaurant.geometry.coordinates
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

            return (
              <Card.Root
                key={restaurant.recordid}
                maxW="sm"
                width="400px"
                borderRadius="lg"
                boxShadow="sm"
                mx="auto"
              >
                <Card.Body>
                  <Heading size="md" mb={2}>
                    {restaurant.fields.name}
                  </Heading>
                  <Text color="gray.600">
                    Category: {restaurant.fields.subtype}
                  </Text>
                </Card.Body>

                <Card.Footer justifyContent="space-between">
                  <Button variant="outline" size="sm">
                    {restaurant.fields.subtype}
                  </Button>
                  <Button
                    as="a"
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    colorScheme="blue"
                  >
                    Directions
                  </Button>
                </Card.Footer>
              </Card.Root>
            )
          })}
        </Stack>
      )}

      <Box display="flex" justifyContent="center" mt={6}>
        <Pagination.Root
          count={totalItems}
          pageSize={pageSize}
          page={page}
          onPageChange={(d) => setPage(d.page)}
        >
          <ButtonGroup variant="ghost" size="sm" w="full">
            <Pagination.PageText format="long" flex="1" />

            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Box>
    </Box>
  )
}

export default RestuarantPost
