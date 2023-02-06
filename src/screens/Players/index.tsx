import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

import { AppError } from "@utils/app-error";

import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";

import { AddPlayerByGroup } from "@storage/player/add-player-by-group";
import { GetPlayerByGroupAndTeam } from "@storage/player/get-player-by-group-and-team";
import { PlayerStorageDTO } from "@storage/player/player-storage-dto";
import { DeletePlayerByGroup } from "@storage/player/delete-player-by-group";
import { DeleteGroupByName } from "@storage/group/delete-group-by-name";
import { Loading } from "@components/Loading";

type RouteParams = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const navigation = useNavigation();

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await AddPlayerByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');
      
      fetchPlayersByTeam();
    } catch (err) {
      if(err instanceof AppError) {
        Alert.alert('Nova Pessoa', err.message);
      } else {
        console.log(err);
        Alert.alert('Nova Pessoa', 'Não foi possível adicionar.');
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      
      const playersByTeam = await GetPlayerByGroupAndTeam(group, team);

      setPlayers(playersByTeam);
      
    } catch (err) {
      console.error(err);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await DeletePlayerByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (err) {
      console.log(err);
      Alert.alert('Remover Pessoa', 'Não foi possível remover essa pessoa.');
    }
  }

  async function removeGroup() {
    try {
      await DeleteGroupByName(group);
      navigation.navigate('groups');
      
    } catch (err) {
      console.log(err);
      Alert.alert('Remover Grupo', 'Não foi possível remover o grupo.')
    }
  }

  async function handleRemoveGroup() {
    Alert.alert('Remover', 'Deseja remover o grupo?', [
      { text: 'Não', style: 'cancel'},
      { text: 'Sim', onPress: () => removeGroup() }
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header 
        showBackButton 
      />

      <Highlight 
        title={group}
        subtitle="Adicione a galera e separe os times"  
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>
      
      <HeaderList>
        <FlatList
          horizontal
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
        />

        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>

      {
        isLoading ? <Loading /> :
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard 
              name={item.name}
              onRemove={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty 
              message="Não há pessoas nesse time."
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1}
          ]}
        />
      }

      <Button 
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleRemoveGroup}
      />
    </Container>
  )
}