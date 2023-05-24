import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createOrders } from 'apiSdk/orders';
import { Error } from 'components/error';
import { OrdersInterface } from 'interfaces/orders';
import { ordersValidationSchema } from 'validationSchema/orders';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function OrdersCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OrdersInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOrders(values);
      resetForm();
      router.push('/orders');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OrdersInterface>({
    initialValues: {
      order_time: new Date(new Date().toDateString()),
      special_requests: '',
      customer_id: null,
      restaurant_id: null,
    },
    validationSchema: ordersValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Orders
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="order_time" mb="4">
            <FormLabel>Order Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values.order_time}
              onChange={(value: Date) => formik.setFieldValue('order_time', value)}
            />
          </FormControl>
          <FormControl id="special_requests" mb="4" isInvalid={!!formik.errors.special_requests}>
            <FormLabel>Special Requests</FormLabel>
            <Input
              type="text"
              name="special_requests"
              value={formik.values.special_requests}
              onChange={formik.handleChange}
            />
            {formik.errors.special_requests && <FormErrorMessage>{formik.errors.special_requests}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UsersInterface>
            formik={formik}
            name={'customer_id'}
            label={'Customer'}
            placeholder={'Select Users'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />
          <AsyncSelect<RestaurantsInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Restaurant'}
            placeholder={'Select Restaurants'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />

          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default OrdersCreatePage;
