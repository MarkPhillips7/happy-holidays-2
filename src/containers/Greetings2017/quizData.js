export const quizData = {
  introduction: `Put away your books and get out that number 2 pencil because it's time for the Phillips family 2017 pop quiz!`,
  questions: [
    {
      question: "In 2017 the Phillipses did NOT travel to",
      answers: [
        "Florida in February",
        "Florida in April",
        "Florida in November",
        "North Carolina in August, September and November",
      ],
      correctAnswers: ["Florida in February"],
      picturesWhenCorrect: [
        require(`../../images/lily-willow-hats-and-shades-medium.jpg`),
        require(`../../images/lily-willow-hugging-beach-medium.jpg`),
        require(`../../images/florida mommy lily willow.jpg`),
        require(`../../images/florida-lily-alligator.jpg`),
        require(`../../images/willow timmy and lily on horses.jpg`),
        require(`../../images/lily-willow-disney-medium.jpg`),
        require(`../../images/wilmington-everybody-medium.jpg`),
      ],
    },
    {
      question: `On the Tower of Terror ride at Disney World Jen's death grip left bruises on which people?`,
      answers: ["Lily", "Willow", "Mark", "Dinah"],
      correctAnswers: ["Willow", "Mark"],
      picturesWhenCorrect: [
        require(`../../images/everybody scared outside tower.jpg`),
        require(`../../images/everybody like a dinosoar.jpg`),
      ],
    },
    {
      question: `What new item did someone get in 2017?`,
      answers: [
        "Mark got a Tesla",
        "Lily got a puppy",
        "Jen got a llama",
        "Willow got a bed",
      ],
      correctAnswers: ["Willow got a bed"],
      picturesWhenCorrect: [
        {
          width: 285,
          height: 508,
          src: "https://www.youtube.com/embed/a23h8u8mB7I",
        },
      ],
    },
    {
      question: `In the May ballet showing what animal was willow?`,
      answers: ["A fox", "A pig", "A wolf", "A butterfly"],
      correctAnswers: ["A wolf"],
      picturesWhenCorrect: [
        require(`../../images/wolf2.jpg`),
        require(`../../images/lily-trumpet-with-friends.jpg`),
        require(`../../images/lily-dusk.jpg`),
        require(`../../images/willow-twirl.jpg`),
      ],
    },
    {
      question: `What are Lily's swim strokes from best to worst?`,
      answers: [
        "Backstroke, freestyle, butterfly, breaststroke",
        "Butterfly, doggy paddle, freestyle, corkscrew",
        "Freestyle, backstroke, breaststroke, butterfly",
        "Butterfly, backstroke, doggy paddle, flail-and-sink",
      ],
      correctAnswers: ["Backstroke, freestyle, butterfly, breaststroke"],
      picturesWhenCorrect: [
        require(`../../images/lily-sit at swimmeet.jpg`),
        require(`../../images/lily-swim backstroke.jpg`),
        require(`../../images/willow-swim-smile.jpg`),
        require(`../../images/willow-swimming.jpg`),
      ],
    },
    {
      question: `Which of these were actual lyrics to the final Disney World handshake?`,
      answers: [
        "Timmy is a rockstar!",
        "Everyone is awesome!",
        "Timmy and Willow are awesome!",
        "To Space Mountain and beyond!",
      ],
      correctAnswers: ["Everyone is awesome!"],
      picturesWhenCorrect: [
        {
          width: 903,
          height: 508,
          src: "https://www.youtube.com/embed/g_QrMdMCSkw",
        },
        require(`../../images/epcot in front of ball with every one and tinkerbell.jpg`),
        require(`../../images/magic kingdom family castle.jpg`),
        require(`../../images/epcot long nosed creature with family.jpg`),
      ],
    },
    {
      question: "Which halloween costume was actually worn this year?",
      answers: [
        "Mark as Sloth from The Goonies",
        "Lily as Bing Bong from Inside Out",
        "Willow as a peacock",
        "Jen as a sloth",
      ],
      correctAnswers: ["Willow as a peacock"],
      picturesWhenCorrect: [
        require(`../../images/willow-peacock.jpg`),
        require(`../../images/lily-jillian-willow-halloween.jpg`),
      ],
    },
    {
      question: `Lily, Willow and Dinah turned`,
      answers: [
        "9, 7 and 9",
        "cat, dog and human",
        "left at the red barn",
        "9, 7 and 8",
        "around, bright eyes",
      ],
      correctAnswers: ["9, 7 and 9"],
      picturesWhenCorrect: [
        require(`../../images/lily-9th birthday.jpg`),
        require(`../../images/willow-7th birthday.jpg`),
        require(`../../images/dinah.jpg`),
        // {width: 677, height: 508, src: 'https://www.youtube.com/embed/lcOxhH8N3Bo'}, Total Eclipse of the Heart
      ],
    },
  ],
  introductionPicture: require("images/phillips-family-2017-large.jpg"),
  picturesWhenGuessedIncorrectly: [
    require("../../images/try-again-clipart-2.jpg"),
    require(`../../images/willow-thing-wrapped-around-head.jpg`),
    require(`../../images/Never_Give_Up_Never_Surrender.webp`),
    require(`../../images/lily-angry-witch.jpg`),
    require(`../../images/smack_my_head_statue.png`),
    require(`../../images/smack_my_head_homer.jpg`),
    require(`../../images/epic_fail.jpg`),
  ],
  resultsByHowManyCorrect: {
    0: {
      comment:
        "Congratulations, it takes a special person to get everything wrong!",
      picture: "",
    },
    1: {
      comment: "Wow, have you even met us before?",
      picture: "",
    },
    2: {
      comment: "You have flunked and must repeat 2017!",
      picture: "",
    },
    3: {
      comment: `We are grading on a curve, but that was still terrible!`,
      picture: "",
    },
    4: {
      comment: "Not bad for failure!",
      picture: "",
    },
    5: {
      comment: `Don't worry, we are grading on a curve!`,
      picture: "",
    },
    6: {
      comment: "Very impressive, you might want to put this on your resume!",
      picture: "",
    },
    7: {
      comment: "Wow, shocking talent!",
      picture: "",
    },
    8: {
      comment: "Pretty impressive, but we know you cheated!",
      picture: "",
    },
  },
};
