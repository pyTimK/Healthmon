const dayGreetings = () => {
  var today = new Date();
  var curHr = today.getHours();

  if (curHr < 12) return "Good morning";
  if (curHr < 18) return "Good afternoon";
  return "Good evening";
};

export default dayGreetings;
