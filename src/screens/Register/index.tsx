import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm } from 'react-hook-form';

import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Form/InputForm';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome e obrigatorio'),
  amount: Yup
    .number()
    .typeError('Informe um valor numerico')
    .positive('O valor nao pode ser negativo')
    .required('Valor e obrigatorio')
})

export function Register(){
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const dataKey = '@gofinances:transactions';

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionsTypesSelect(type: 'up' | 'down'){
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }


  async function handleRegister(form: FormData) {

    if(!transactionType)
      return Alert.alert('Selecione o tipo da transacao')

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria')

    const newTransaction = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))
    } catch (error) {
      console.log(error)
      Alert.alert('Nao foi possivel salvar')
    }

  }

  useEffect(() => {
    async function loadData(){
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));

    }

    loadData();

     /* async function removeAll() {
      await AsyncStorage.removeItem(dataKey);
     }

     removeAll() */
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              //@ts-ignore
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              //@ts-ignore
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              //@ts-ignore
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              //@ts-ignore
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionsTypesSelect('up')}
                isActive={transactionType === 'up'}
              />

              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionsTypesSelect('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
