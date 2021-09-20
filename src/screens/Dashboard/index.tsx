import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList
} from './styles';

export function Dashboard(){
  const data = [
    {
      title:"Desenvolvimento de site",
      amount:"R$ 12.000,00",
      category:{
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date:"12/12/2012"
    },
    {
      title:"Desenvolvimento de site",
      amount:"R$ 12.000,00",
      category:{
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date:"12/12/2012"
    },
    {
      title:"Desenvolvimento de site",
      amount:"R$ 12.000,00",
      category:{
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date:"12/12/2012"
    }
  ]

  return(
    <Container>
      <Header>

        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: 'https://avatars.githubusercontent.com/u/37482325' }}
            />

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Rodrigo</UserName>
            </User>

          </UserInfo>

          <Icon name="power"/>
        </UserWrapper>

      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saidas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          renderItem={({ item }) => <TransactionCard data={item}/>}
        />

      </Transactions>
    </Container>
  )
}


