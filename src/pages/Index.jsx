import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack, Progress, useToast } from "@chakra-ui/react";
import { FaSave, FaUserPlus } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyWeight, setDailyWeight] = useState("");
  const [habit, setHabit] = useState("");
  const [daysWithoutHabit, setDaysWithoutHabit] = useState(0);
  const [totalWeightLoss, setTotalWeightLoss] = useState(0);
  const [initialWeight, setInitialWeight] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysWithoutHabit(diffDays);
  }, [endDate]);

  const handleSave = async () => {
    const userData = {
      name,
      endDate,
      dailyWeight,
      habit,
      totalWeightLoss,
      initialWeight: initialWeight || dailyWeight,
    };
    const success = await client.set(`user:${name}`, userData);
    if (success) {
      toast({
        title: "Saved",
        description: "Your data has been saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLoad = async () => {
    const data = await client.get(`user:${name}`);
    if (data) {
      const userData = data[0].value;
      setName(userData.name);
      setEndDate(userData.endDate);
      setDailyWeight(userData.dailyWeight);
      setHabit(userData.habit);
      setTotalWeightLoss(userData.totalWeightLoss);
      setInitialWeight(userData.initialWeight);
    } else {
      toast({
        title: "Not Found",
        description: "No data found for this user.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>End Date of Competition</FormLabel>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Daily Weigh-in</FormLabel>
          <NumberInput precision={2} step={0.1}>
            <NumberInputField value={dailyWeight} onChange={(e) => setDailyWeight(e.target.value)} />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Habit to Eliminate</FormLabel>
          <Input placeholder="Enter habit" value={habit} onChange={(e) => setHabit(e.target.value)} />
        </FormControl>
        <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleSave}>
          Save
        </Button>
        <Button leftIcon={<FaUserPlus />} colorScheme="green" onClick={handleLoad}>
          Load
        </Button>
        <Box>
          <Text fontSize="xl">
            Progress of days without {habit}: {daysWithoutHabit} days
          </Text>
          <Progress colorScheme="green" size="lg" value={(daysWithoutHabit / 30) * 100} />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
