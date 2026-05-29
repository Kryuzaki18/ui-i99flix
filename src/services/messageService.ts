import { message } from "antd";

const messageService = {
  success: (content: string) => message.success(content),
  error: (content: string) => message.error(content),
  info: (content: string) => message.info(content),
  warning: (content: string) => message.warning(content),
};

export default messageService;
