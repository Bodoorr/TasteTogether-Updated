import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Stack,
  Card,
  Button,
  Center,
  Heading
} from '@chakra-ui/react'
const RandomRestaurant = () => {
  //use states to get restaurant name, category, and coordinates
  const [restaurant, setRestaurant] = useState('')
  const [category, setCategory] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  // useState to store the fetched API results as an array
  const [data, setData] = useState([])

  //pickRandom is a function that takes the fetched API results as a paramenter and randomily picked a restaurant from that array and update the components states with that restaurant information
  const pickRandom = (records) => {
    if (records.length > 0) {
      const random = records[Math.floor(Math.random() * records.length)]
      setRestaurant(random.fields.name)
      setCategory(random.fields.subtype)
      setCoordinates(random.geometry.coordinates)
    }
  }

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        //fetch data from the API
        const response = await axios.get(
          'https://www.data.gov.bh/api/records/1.0/search/?dataset=restaurants0&rows=1600'
        )
        // extract the records from the response
        const records = response.data.records
        //update setData state with the records value
        setData(records)
        //pass the records as an argument to pickRandom function (select random restaurant)
        pickRandom(records)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      }
    }

    getRestaurants()
  }, [])

  const mapsUrl = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`
    : null

  return (
    <Center minH="100vh" px={4}>
      <Box maxW="520px" w="100%">
        <Card.Root borderRadius="2xl" boxShadow="md" bg="white" p={6}>
          <Stack spacing={6} textAlign="center">
            {data.length === 0 ? (
              <>
                <Box fontSize="52px">🍽️</Box>

                <Heading size="md" color="gray.900">
                  Restaurants coming soon
                </Heading>

                <Text color="gray.600">
                  Our restaurant data is currently unavailable.
                  <br />
                  Stay tuned, we'll be back with tasty picks!
                </Text>

                <Button
                  variant="outline"
                  borderRadius="full"
                  onClick={() => window.location.reload()}
                  bg="#99cce3ff"
                >
                  Try again later
                </Button>
              </>
            ) : (
              <>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="gray.900">
                    {restaurant || 'Pick a Random Restaurant'}
                  </Text>

                  {restaurant && (
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Category: {category}
                    </Text>
                  )}
                </Box>

                {mapsUrl && (
                  <Button
                    as="a"
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    borderRadius="full"
                    colorScheme="blue"
                    size="sm"
                  >
                    Get Directions
                  </Button>
                )}

                <Box h="1px" bg="gray.200" />

                <Button
                  onClick={() => pickRandom(data)}
                  borderRadius="full"
                  bg="gray.900"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size="md"
                >
                  Generate New Restaurant
                </Button>
              </>
            )}
          </Stack>
        </Card.Root>
      </Box>
    </Center>
  )
}

export default RandomRestaurant
