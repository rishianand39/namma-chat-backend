export const sendResponse = ({
  status,
  data,
  message,
  code
}: {
  status: boolean;
  code : number;
  data?: any;
  message?: string;
}) => {
  return {
    success: status,
    code : code,
    data,
    message,
  }
};

