import React from "react";
import { ResponsiveContext, Form, FormField, Button, Box, Text } from "grommet";
export interface ContactFormState {
  formSubmitted: boolean;
}
export class ContactForm extends React.Component<{}, ContactFormState> {
  public state: ContactFormState = {
    formSubmitted: false
  };
  render() {
    return (
      <ResponsiveContext.Consumer>
        {size =>
          !this.state.formSubmitted ? (
            <Form
              name="contact"
              data-netlify="true"
              onSubmit={() => this.setState({ formSubmitted: true })}
            >
              <FormField name="name" label="Name">
                {/* <TextInput name="name" placeholder="Kiran Bedi" /> */}
              </FormField>
              <FormField name="email" label="Email" required>
                {/* <TextInput name="email" placeholder="kiran@gmail.com" /> */}
              </FormField>
              <FormField name="message" label="Message">
                {/* <TextInput name="message" placeholder="Your Message" /> */}
              </FormField>
              <Box direction="row" justify="center" margin={{ top: "medium" }}>
                <Button type="submit" primary label="Submit" />
              </Box>
            </Form>
          ) : (
            <Box margin="large" animation="fadeIn" gap="medium">
              <Text textAlign="center">
                <b>Thank you!</b>
              </Text>
              <Text textAlign="center">We will get in touch with you soon.</Text>
            </Box>
          )
        }
      </ResponsiveContext.Consumer>
    );
  }
}
