import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Container,
  Header,
  Title,
  Content,
  CharContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  color: string;
  total: number;
  totalFormatted: string;
  percent: string;
}

export function Resume(){
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev'){
    if(action === 'next'){
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData(){
    setIsLoading(true);
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    //await AsyncStorage.removeItem('@gofinances:transactions')
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives: TransactionData[] = responseFormatted
    .filter((expensive: TransactionData) =>
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = expensives
    .reduce((acumullator: number, expensive: TransactionData) => {
      return acumullator + Number(expensive.amount);
    }, 0)

    const totalByCategory:CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      })

      if(categorySum > 0){
        const totalFormatted = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent
        })
      }

    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoading ?
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer>
        :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flex: 1,
              padding: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton
                onPress={() => handleDateChange('prev')}
              >
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>

              <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

              <MonthSelectButton
                onPress={() => handleDateChange('next')}
              >
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <CharContainer>
              <VictoryPie
                width={350}
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={60}
                x="percent"
                y="total"
              />
            </CharContainer>

            {
              totalByCategories.map((item) => (
                <HistoryCard
                  key={item.key}
                  title={item.name}
                  amount={String(item.total)}
                  color={item.color}
                />
              ))
            }
          </Content>
      }
    </Container>
  )
}
