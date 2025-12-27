import { useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Center,
  Image
} from '@chakra-ui/react'

const Home = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>
        {`
         @import url('https://fonts.googleapis.com/css2?family=Coiny&family=Wendy+One&display=swap');

          .font {
            font-family: 'Coiny', sans-serif;
          }
        `}
      </style>

      <Box minH="100vh" bg="white">
        <Flex
          direction="column"
          maxW="1200px"
          mx="auto"
          px={{ base: 6, md: 12 }}
          py={6}
          minH="100vh"
        >
          <Flex justify="space-between" align="center">
            <Text
              fontSize="xl"
              fontWeight="500"
              cursor="pointer"
              onClick={() => navigate('/')}
            >
              Taste Together
            </Text>

            <HStack spacing={8}>
              <Text
                cursor="pointer"
                fontWeight="600"
                _hover={{ opacity: 0.7 }}
                onClick={() => navigate('/restaurants')}
                
              >
                Restaurants
              </Text>

              <Text
                cursor="pointer"
                fontWeight="600"
                _hover={{ opacity: 0.7 }}
                onClick={() => navigate('/recipes')}
              >
                Recipes
              </Text>

              <Text
                cursor="pointer"
                fontWeight="500"
                pl={2}
                _hover={{ opacity: 0.7 }}
                onClick={() => navigate('/register')}
              >
                Start Tasting
              </Text>
            </HStack>
          </Flex>

          <Center flex="1" mt={{ base: 0, md: 10, lg: 20 }}>
            <VStack spacing={6} textAlign="center">
              <Text fontSize={{ base: '6xl', md: '8xl' }} fontWeight="900"
              className='font'>
                TASTE TOGETHER
              </Text>

              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                maxW="420px"
                color="gray.600"
              >
                Because food tastes better when we share it together
              </Text>

              <HStack spacing={4} pt={4}>
                <Button size="lg" px={10} onClick={() => navigate('/register')} >
                  Start Tasting
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  px={10}
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
              </HStack>
            </VStack>
          </Center>

          <Center pb={4} mt={{ base: 0, md: 0, lg: 'auto' }}>
            <Image
              src="/images/image.png"
              alt="TasteTogether"
              w={{ base: '380px', md: '600px', lg: '750px' }}
              maxW="100%"
              transition="transform 0.35s ease"
            />
          </Center>
        </Flex>
      </Box>
    </>
  )
}

export default Home
