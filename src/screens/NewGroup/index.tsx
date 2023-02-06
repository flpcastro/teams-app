import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { createGroup } from "@storage/group/create-group";

import { Container, Content, Icon } from "./styles";
import { AppError } from "@utils/app-error";
import { Alert } from "react-native";

export function NewGroup() {
  const [group, setGroup] = useState('');

  const navigation = useNavigation();
  
  async function handleNew() {
    try {
      if(group.trim().length === 0) {
        return Alert.alert('Novo grupo', 'Informe o nome da turma.');
      }

      await createGroup(group);
      navigation.navigate('players', { group })
    } catch (err) {
      if(err instanceof AppError) {
        Alert.alert('Novo grupo', err.message);
      } else {
        Alert.alert('Novo grupo', 'Não foi possível criar um novo grupo.');
        console.log(err);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight 
          title="Nova Turma" 
          subtitle="Cria a turma para adicionar as pessoas"
        />

        <Input 
          placeholder="Nome da turma"
          onChangeText={setGroup}
        />

        <Button 
          title="Criar"
          style={{marginTop: 20}}
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}