export const formatDate = (date: Date | string) => {
  const createdDate = new Date(date);
  const day: number = createdDate.getDate();
  const month: number = createdDate.getMonth() + 1;
  const year: number = createdDate.getFullYear();
  const formattedDate: string = `${day}/${month}/${year}`;

  return formattedDate;
};
