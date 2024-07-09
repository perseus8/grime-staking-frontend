export const getDateString = (date: any) => {
    return new Date(Number(date) * 1000).toLocaleString()
  }