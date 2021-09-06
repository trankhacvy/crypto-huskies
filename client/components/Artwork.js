import { useState } from "react";
import { utils, BigNumber } from "ethers";
import {
  Box,
  Center,
  useColorModeValue,
  Text,
  Stack,
  HStack,
  Image,
  Skeleton,
  Icon,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import truncateHash from "../utils/truncateHash";
import { FaEthereum } from "react-icons/fa";
import ConfirmBuyModal from "./ConfirmBuyModal";

export default function Artwork(props) {
  const { tokenId, price, name, image, seller, owner, sold } = props;
  const [art, setArt] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  if (!tokenId) {
    return <Skeleton borderRadius="2xl" width="300px" height="400px" />;
  }

  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${image})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={image}
            fallbackSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAF+hJREFUeF7tXfee3NQZnft8GDdceQRqTAnGpr1VIJQAAUKHAHmdnfzmtq9e6UrTpPHxP4b17s6uRtLR+U75wkvP/WMbNmGz3Ww38e/tdrMJm80m/p3+P9S/dx/On7fZbnafmP69frr6fP794qeLr0+vdxVfR76e/H75B+p8vav0QgM/37zX48eB/97pOEx6vfjZ/HiX3z8fH/e4l8M09fWu0vtq3l/2fujXq79N+nn840XHg/7de3/L+TT2evJ40Hllj/uG/ZHn59j5m84373jQrylfL7z83MfbevDiSeX8YQfJfobzEXZRud+uvFnu623LuRb/Tt+dnxT2O/KD1H698r3Euy8+nX6TntdLF7H80/hp+UnG39z63+r1xP/u3h26BNOXyI+Yf+96PfWDlJuie7TV67Frhn4e+n702ePnk//uyq+Tv453BvKbtvcLDB2v4fM3vPTcx9t0A6cXmYUk8aQfRxJxxdc7W+tOJe/U5cqXyOXd2fOdhN+p2R20/L5jSNL/evnnV3dqjazm9Ro/X0XaDiThyFDfx/x18s5eLjK6U5cng+briXONPzGo98V9PXs+leMx/HozkUS8vwrhO56E0hOMPX/Dy9c+Trco9Wa1kSR/k3zwvDtI+VoOW1139vqF5ZbJfuiu12Ow7wFhuYi91/FuqC3kyjck/ni5L5KkhzR1N6s3vnxythBe4yz/unpWyju8+76J12OI20A6C1Q+Ygz+XuznG3s6GTuf6G2tJ7SCXoVMIwgeX2/3iMUeofdHEnAScJIKnevnJIQghWd2I0nCo7GrPiITOEm9ByWoNg/xlVl4HEMCGTjJKTlJRBD5LErTkr2mW+AkaepmuA+bRunpHTiJnII6077u6daBOEl45donWxrtynFJ33QLnKTc4cFJaCI8yE2HuNbCOIlAEI4k4k2HTsKeivjI0J/maN0IOonSeWbpMjOnW0LHm66TJASpwOGz/z4kASeh6R2Jp/tOt8BJPBXsdDpJePnaJ9ukXziKpZ4L74Mk4CTgJCPTrSXqJBFBrCwg7QHQSez8nHQLNv5TBxKcZP2cJCNImba0kQSchHvTerxi8G6Rl0+N+lekk4RXrv2zOp4MkhB0CEUSnETPaKxbinOPQyIJOMlpOUl6xGIPf+nkByfxPE7wbtEUyOOs5GkutpmGG3xF3q2MIBw7pGenXCzcjgJOAk5SpX/lArZTO+Joa/RuxQuEu1ulqxecxMu7jCGJr3uAk6yRkygEGUEScBJFATrdocpZDE4yPN1aUp4kI4j1z6c00Ph0SySxoJMIxR15Ek6o15knCa8+/2n0YjnTfJHAiCbUGtOATuI9g/tTQOgkDqttmJqXlydRCNJIYnUgCXQS6CRdycSVZdwjgvB8QusaFnN9eLdUvoMlINmBomMJnUTiqMqILzjjHl699ml8vnLn2vnj0EmQcZftJjzicNkZ94QgZEOlqh/DQAoLgU5CXENxN5XpBieRyOqnT5etk1QEkaEfXwGtc2xwkmk9WMoVDZ1ED3y8XrRl9G5JBFFI4mfOB5AEOgl0kjreU2Rspb1b8QKheT3NcsFJikUNvVulJ+1Z7N0Krz3/mdtNwgfV0EkyMHS1s/Q1OCJPso7eLYEgslFxoEuVTbfg3UIXsPSmXVYXcEYQqqVUtqFy66zmGegkvT1ffUji5jvg3RL1OmMu4GN6t+IF4rauK8INTgJO4vd8taZNl9EFHF67/hnr5u1DEnAScBLpzeNdynlk23QUDE+3FpcnKQgy7qUCJ+nbhwJOckmcJLx2/fPsxSLpfMozHTgJOIlxmnV1D69DJ4kchBoVBxrwwEnqZiLsJxnah3JZnCS8fv1zWpRU16/p2YqPE2JtGrxbnS32fdMt6CTL0EkEgkzr5gUnASchJOnf0bgunaQiiPDrz0QSeLcOP92CTtLqwep3AU/h1GI6t8OAHUlv7RYc3F4KTgJO4riUL21nYnj9+hftXbIzkQQ6yeGRBJzkPJwkIwjfhHTF9qL37Dnv2IMN7xYj8NBJ1qSTMARhz3R6L/dMJAEnOTySgJOclpNEku5nztmuwp4uVXAScJIL5CTh9RtfsFW1qm3iQEgCTnJ4JAEnOQ0niY9YbNnq5iqWyIGTtL1pV9SbmZGVH7/Y/sGavr1uX9phuON44CRL5iSEIFIIkX78AyEJOMnhkQSc5LicJCNITzcvOAkha1aQ9Z5zgSiExPBurde7Ff5241+pm7fY+E+AJOAkh0cScJLjcBKFIBxJEmKAkzg6j+Jo8/aFWERO3AScZEmcJCKILqmnGnfbDai9KtR+gjxJ5QOMpycfdE83L9Wb6l6AuhbPvB3YTyIPb+toz+8CzhfInG5ecBJwkrSLUE49E+K2OwzovFlDxr1eIPyuBU6iy1zaeyvcvSq8o5cyaEVKdZMzEWfQu5UXyC4n424ukLErH5wEnMRwrnjJU8u7cYHX6Z7luD260Tk5iYsg4CSqW6Przp7EVftHULz8GeAkg/tCXN1tv7aUuftJ4gVSk4Q8R89OClJ+1fxftLyDk4CTXB4nCY9ufJm7ef0thfRsnJamNFYr+bOamS5g6CTQScTsT3C6/ZBEPRuMNjgKBJmGJNBJ+jL88G6tmZNkBOHA0HiOztAR//VESALv1uGRBN6tad6teIG05tZ29NvePGX3qoOTgJOsn5OERze/bHTzgpPILbXOfKpuZ4VOQo4KnyOQV4xPgvgOw9YUsDyy8LVtJ9RJEoKoRkU1t+5DEnAScJKGy3nFOkl4dPMrsSfdUgxwEjv5gE5CXMajpGbxeZ1yuhxIcNr0QLMUnSRykGY37ywk4QenJBPzXm3l0UHvlt7uKnM5tDtSfdwo09jjfqw97uGNm191dvOCk4CTsNyQANGGi3ag5X0tnCQ8uvFVzqQP7KWehSTgJOAk6+ckFUFsNy9NI2zXiU0siN1U0Elq+Z5jzhIWcXi3HGFtQZwkknQ9rwcn4Y2SiVNJl3O2pmcvGuUafK7FkUR8H+FlY9yt5/VqTBp73I+5xz28cfPrmd284CTgJJfPSRSC+NMS6CQxzdSHJKwAI8lL9g7ParPSvyPjvtg8CUOQsW5ecJLKF9h0xqpEzkeQJ1Em8PXoJOkCKQtC+J0sJsRUDPQgijt0EnCSjumWSCieL+Me3rj19YG6ecFJwEkuj5NEBBnu5i2/NHSSMi2piDtp2tTqwULGfckZ9/Dmra9lbt7JBlpZQz5DQieh4wFOUh6HcgJ1T8X93N6tjCCybQKchHQQ4uN+/1P3dKtyumEkgU7CpoXcBXwmThLevPXvmElnPN1b5D0jcw5OAk6yfk6iEKSnmxecxGsS7EYS6CSj+1OWxEkigui8w7z2Eugk0EkayUq+PWBlnKReIEONiuAk4CQyb+E3JPbnV4b2hbDuXr1/5QycxEGQErQ/dA8WOAk4yfo4Sb5AmM2k2ajYyneAk4CTSBezv6PRcx0TkpTgrrfT8ZycJLx565vq5vWyCxFPZuU7wEnASdbPSSKCUKNiH5KAk4CTPCucJLx1+5ukpKveCVH1A51E6kC8c5hRK75MxkXj/HWqsnhgXwhfNuNlD7N+1Qx4lmU2XkuI8/26XMeeTCaRgh44Gi32+cNiD82e061jZdzjI5bOLYgiUnASlteYk+8oXivkSca3/S6Pk1QEqVtuB5CkoAw4iUjgm2KoPiRJHA3erWV7t8JbO5Ku93vn/+9FEnAScJJL5SThrdvf5mZFPqoDJ/FVm8azNjiJMt1eECcpCCK9RHqhZN90y9+rDp0EOsl6dZKEIKoN1Rbi+fNscBKdVsjHSQ1vwEn0jLQx3Sqz1AV5t+IFUrLnRrHUXboseg/vVnqTKSrgt5cgT8Knd6o3jPeKDfZ8nc+7Fd6+/S3JIAVJ+LxerHtoKKPQSaCTVCPhZekkhCB1J4nX8AdO4jUr1ulfB5LQvWfPZCLyJCfNk1QEmbtH2tV34d3iGx2hk9TzwU633My5OqkOqbhPzbgnBCk6CN/PyZk6dBK3IbE4ECp360AScJJ1cZLw9u3v2t284CQqbKkLBTwTFH2Mbpyy2qfI533TrUxshWOr5ZKFd2toSwFX93q9WxJBjowk0El4a3x6lLbdvPBuLSlPkhFEKud2Sq2ar0y1KnQSBTXGmyruWNBJ8jWwfE6SLpDS+aObAsFJ7LIbYdWesjceOone4+Hrbqw3bAE6SXj7he8cS2m6sptIAp0kD0PASURu6ALzJBFB6hQrbDZXXv7jSEgCTgJO0uMCPicnCX9/4T/b9EN6wbYRJMnjGHi3hrp5CxY70y0aZ4nj3zfdQp6kMucjercUgozs5jsSkiBPgjxJD5Kco3crIYiwmcxAEnAScBJrqRDiqvPPZPQ0AsVy8iQugoCTyOnU8E5BZ79HY28IvFu743o13UuVDbPVucDeELKhHKd3KyKI0YPBSZydeoSssrXDvXWWWaWTOQcnsf4D1c6yIO9WvkDGcw1uezk4CXQSnuPo1i0y52p07RqPm/ACnlYnCX9/4XvTrAhO0pjeKWTtRZJkJ2E5iXoLRcZd6CglV7QgTlIRhLpRrzbEQaxSDJ1kbKcgOImvW7Q2ay2bkzAEGW5fh07Ck3JSN+pFEr8HC5xkyZwkIojt5gUnKY3dfD2daaDUe+PVnnnu12ln+Ft74+HdWoJ3K7xz53vVzWuRBJwEnCTh3LPXBRwfsfiedLkTOs2twUkKovrHAzoJCRXufg9Xt1gHJ6kIYrt5wUlIxFB5GCZ1pccocBLhNGOHq+XmO5YLOFsa9Dsk8zkTvFvhnd2YdzRzDk4CTlJWKTBupDL4Nt/BdxlSm8t4y/tydJLwzp0fSAepYSCb3pXz6hIIm+kChncL3q21eLcKgthuXl4AUB63wEmiDsSnVQ5HAye5HE6SEYQjRqvlHZwEnGSoWTM9hts/svp5bZwkXiDTu3nBScBJng1OEh7f+YF180ok4bVYQ9MB6CTQSS5VJyEEGe3mBSfhOZkSMwYnGfOmXVXrv5yWts6nsk9mGTpJRZAht6mfOQcnASe5fE6SEKQ2Kkpu0b8vBJwEnOQyOUl4fPfHOnxoem1U+4bcqw7v1rGRBHmSIhuRSHmyjLtAkEndvOAk4CRz9savi5MQglQgSIACTlLyH43ZPt8AYg4YvFs2KbhOnSQ8vvMjeZjVTkJSjPOOOGb79dokRJKsrmXzcw3IuPNNXk7Lu3msHWjtqE7TcS6I/STT9pOEx3d/qnvSNXSAk5RLvo2pycxLo0lVhyKw2ALNPBcwOMnpOElEEJ73uPLyH13tJeAk4CSXx0nCu3d/2hrWIW514CSWUdgUNccaS+LASdbKSSJJp+xvo20cOom7o7AV+pFI0sqcW6WYdCdwEm+rcH837+HyJBFByIHFAiHkcK91HuAk4CRpbZyecjYU9XpvGFLcnb4w3qw46fUOr5NEki6uBbUfBJzEmTap7t0+JEmIAe/WurxbAkEMkrj7K8BJwEmG9qFYtOCPS20FfJk6SbpAhIKeE3N8nRaDGPFsOJpJllMN6CRKTxLHD5xkXHc7fcY9vHv3Z9PNC04yJ98x7G5mWh6vaIROwiBlib1bFUGEsq10D+gkCgl1oyI4CRNLW+0lrXzHsjkJQ5CBO6CV2NkYA5wEnORyOUm8QJr7GPj+BnCSvEqRjRIPgiTQSWo39GQv4PE5SXhy72fWzasy6WrkULGCD8IZ8EAngU5yaToJQxDmpdKuXXAS2iTFNypl7mEUcHCSi+EkFUEmdfOCkzg7DLPky28mqbjX74pCnqQelyXrJOHJbszb2AFnMungJGInYekTo2do8kV4+0D6FHdwkiVxkvDk3i9Ufcc6c+Vtr+2liU/d4CSsa7e1DRc6CZ1FK/JuFQQZ7OYFJymHx/FSlbDUoadb8G5xJKESQ9uN7LfvHKZ3KyOIcutzlK/P0dBJprWXgJMwkjGwN37Z3q14gaRTn1vd+Xx5bLoF75b2EIGT8FwRz4AP6Ba1w2BYcZ/mBdxfJwlP7/3S6OblhNNL0Hk93siTCJwd3DwFTrIGTpIRpKdRcQxJaKkOvFvwbiXReAaSsAIMvVX4HJwkPL33a8ykU5zRosXkbl7oJNBJspXfy3/UiUduQxibmJ5TJ0kI4mXOwUmkFV0lLW3VT3q85Dcb6CR8O3Bx7a6Lk4Sn93/t7OYFJ+E5mXTym3W3e+Q7wEkWyUme3Pu1unmntbyDk/T1YEEnkTsdJyLJmTkJIYhx5bYzwuAkVjea3qgInWQNOkkk6U03Ks9Mg5OAk+S8Rj1fVCcBn17GDAUtu03uXrEdeCKSnEknCU/v/2b2pFOZCfVa20kDOAk4iVTBqc5Kxmjl+dR6MsmkblIPFreT+Lqcy+wm9G5FBJG6hX1mHm+b4KujeY9UVjKRJ0GepGrIeyLJiTlJeO/+b1YHUdMZ6CS0hzLbdt3xfvm3edMtcJIlcpL4iNU9rwcnER29vIDTy3/Iqh/oJGvkJBFB+hoVk6GxvXkKnASc5PI4CSEI25MOTpKCsgVZ+7f9+vsxWJwGeRIVrtt7unVkTiIQRN4B2bQBnESNeMFJyk2jlTWVSpHYnsLuPpW1DXgBy3QrPaE46RHDBw/p3UoXSGO77WiuAZwEnER41Ia6h/1dlUvfmRjee/B72lHodm8Y6BCLIcBJ+pCkHid4t9hjq6l/EUbPtgv4tPtJKoL0d/NCJwEnoZO7Pb1jrt0Oxb2dOZ+ouB+Yk2QEqYy0iSQiLwJOAk4iO4wGMue7T2xMt9z9M2VaOqa4n4aThPfu/z7SzWuTgvBuTd0bPzzdys8dyJMs0LsV3n/we+rmlXvYwEnEEWjsCxEGTm63oXlgi9shT6JH6cvkJBlBZPuD36jYypyDk4CTXC4nCe8/+G/2YnmLj9rTLXAS/mStNoS4vWIt+1YeIso6lI5kIrxbp/BuxUesmKUemmdDJ6nPT7KX6TiKOzgJtaGcWyeJCEL3tvysDU5i5/XgJEaAoNPEf9LwpIOhBpNF5knoAslu0z2QZKe8xz3gkzcFIU9iEbzVzYuM+17JxIk6iUIQ7o0BJ6mzKNWQaBBXl5uoXjA/ww9Ooo8jn/1RHe7c6dZhdJJ4gVTPVfwJ90cS6CTQSViXVM6mWy+W2Y3ZobifmpOEDx784XokC5bESwacBJzE3sifCU4iEOTQSAJOclgk2d1xI8dT7SCa82FnIlnkveksSRT+FgOeh6oI0u7mdZKEvBWi4QKGTgKdxEtvpKf4ob3qy/Juhfcf/GGbFcv2VnAS4mS1l8nPNcgNXX6by6EUd+gkp9NJwgcP/1DdvAMuyuy+BCfhcVxvkS28WzTuKcuZvEcNbon39gEvIOO+I+mmbcLd873/dAucBJykNC6K/Ic63/h0S2bWfVc0N9oeOuNOCNLdzQtOou+F4k2forgzRLZ76qGTLEEniSRdTj0GdsSBk4CTCNWTbyaz542Zpqn9Kex0Ul7Ahrv8DDpJ+ODhnyPdvOAkFNk3oXL+Hsc32S8OAydZKyeJCDLayg1OwiaTUjXdbq82+vjxvSHJm6bc0qqr+FDTLegkfCdi8v/sy0nChw//ZEOpPDWYlDkHJwEnUXkYs3hLImuvC9jvwTqtThIfsYoxjLaSyhrR5rZRcBJwkgvnJBFBuIuSe7Dsstqhbbh0ZUMngU4iOUc+wwb3xi9TJ2EI4mfO3U1B4CTgJCY31MqvWI7Wp1swDnFGnSR8+PAvmmKVC70+Q4KTyPsaJS6tbjG8pXbWdAs6SX6gOZ93Kz1iNfakg5PwOb+zOUslJ3l3EtWNwrtVKo5GXccL1EnChy/+xUyX1vsCTjLgEcrjGOgkpDVP3/ZLXrbe6VYa3Z7Gu1URpLebF5ykhSR8oSS18EEn0fmVdXESQhDTyySdMPtkhE0LPPIk8xR3cJKTc5JI0vkGpIQQJc/AnsFjHqIoldBJynGSORDpNgUnGdoXsg7vVvjoxf9RJt1YjcBJ+MPu8D4UXr/JlSX7tOz2P01xAWc9obctBftJiEnTWr2+tpSMINwrdEVbYUYaFWkDley1Mt6uAynuyJMgT3LqPElFkKEM+aH3O4CTKHVlrgsYnOTonCR8tBvzut28bCoDTlJLeGU3L3SS1sLMsc1TpUuKP/4tUSeJCKLnVbr0ixYEgZOAk7R0i2EnQXUeTG6xP69O8n93b0mWaXoxGAAAAABJRU5ErkJggg=="
          />
        </Box>
        <Stack pt={6}>
          <Text
            color="purple.500"
            fontWeight="bold"
            textAlign="center"
            fontSize={"2xl"}
          >
            {name}
          </Text>
        </Stack>
        <HStack mt="4" justify="space-between">
          <Stack>
            <Box>
              <Text fontWeight="semibold" fontSize="xs" color="gray.800">
                Seller
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="purple.500">
                {truncateHash(seller.id)}
              </Text>
            </Box>
            {sold && (
              <Box>
                <Text fontWeight="semibold" fontSize="xs" color="gray.800">
                  Owned
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="purple.500">
                  {truncateHash(owner.id)}
                </Text>
              </Box>
            )}
          </Stack>
          <Flex alignItems="center">
            <Text color="gray.600" fontWeight={800} fontSize={"sm"}>
              {utils.formatEther(BigNumber.from(price))}{" "}
              <Icon as={FaEthereum} />
            </Text>
            {!sold && (
              <Button
                colorScheme="purple"
                size="sm"
                onClick={() => {
                  setArt(props);
                  onOpen();
                }}
                ml="1"
              >
                Buy
              </Button>
            )}
          </Flex>
        </HStack>
      </Box>
      <ConfirmBuyModal art={art} isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}
