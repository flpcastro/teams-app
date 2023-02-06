import { Button } from "@components/Button";
import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllGroups } from "@storage/group/get-all-groups";

import { useCallback, useState } from "react";
import { FlatList } from "react-native";

import { Container } from "./styles";

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new'); 
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      
      const data = await getAllGroups();
      
      setGroups(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []))

  return (
    <Container>
      <Header />

      <Highlight 
        title="Turmas" 
        subtitle="Jogue com a sua turma" 
      />

      {
        isLoading ? <Loading /> :
        <FlatList 
          data={groups}
          keyExtractor={item => item}
          renderItem={ ({ item }) => (
            <GroupCard 
              title={item}
              onPress={() => handleOpenGroup(item)}
            /> 
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty 
              message="Que tal cadastrar a primeira turma?"
            />
          )}
        />
      }

      <Button 
        title="Criar nova turma"
        onPress={handleNewGroup}
      />
    </Container>
  )
}