import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  SpacerProps,
} from "@chakra-ui/react";
import { Field, useField } from "formik";
import { CSSProperties } from "react";
import { FC } from "react";
import Wrapper from "./UI/Wrapper";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  boxProps?: SpacerProps;
};

const FormInput: FC<FormInputProps> = ({ size: _, boxProps, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <Box {...boxProps}>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
        <Input
          {...props}
          id={field.name}
          placeholder={props.label}
          {...field}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </Box>
  );
};

export default FormInput;
