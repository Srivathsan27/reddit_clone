import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { FC } from "react";
import { createURQLClient } from "../cache/client";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useCreateNewPostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/hooks/useIsAuth";

interface CreatePostProps {}

const CreatePost: FC<CreatePostProps> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreateNewPostMutation();

  useIsAuth("create-post");

  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          title: "",
          content: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({
            input: values,
          });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormInput name="title" label="Title" />
              <FormInput
                inputType="textarea"
                name="content"
                label="Content"
                boxProps={{
                  mt: 4,
                }}
              />

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variant="solid"
                colorScheme="green"
              >
                Post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient)(CreatePost);
