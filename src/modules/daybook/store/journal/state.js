export default () => ({
  isLoading: true,
  entries: [
    {
      id: new Date().getTime(), // 12315646734
      date: new Date().toDateString(), // Sat 23, July
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta recusandae iusto harum sint maxime laborum.',
      picture: null,
    },
    {
      id: new Date().getTime() + 1000, // 12315646734
      date: new Date().toDateString(), // Sat 23, July
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, blanditiis.',
      picture: null,
    },
    {
      id: new Date().getTime() + 2000, // 12315646734
      date: new Date().toDateString(), // Sat 23, July
      text: 'Lorem ipsum dolor sit amet.',
      picture: null,
    },
  ]
});