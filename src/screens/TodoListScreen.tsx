import { FlatList, SectionList, Text, View } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useColors } from "../theme/color";
// import { format } from "date-fns";
import { useTaskStore } from "../store/taskStore";
import { TaskItem } from "../components/TaskItem";




function TodoListScreen() {
  // Use a permissive navigation type for now so navigate('AddTask') is allowed
  const navigation = useNavigation<any>();
  const colors = useColors();
  const tasks = useTaskStore((state) => state.tasks);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const sections = [
    { title: "", data: pendingTasks }, // No header for pending
    { title: "Completed", data: completedTasks },
  ].filter((section) => section.data.length > 0);
//   const currentDate = format(new Date(), "MMMM dd, yyyy");
  const currentDate = "27 April, 2024"; // Placeholder date

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <Header>
        <BackButton
          onPress={() => {
            /* Optional back logic */
          }}
          accessibilityRole="button"
        >
          <Text style={{ color: colors.primary, fontSize: 24 }}>{"<"}</Text>
        </BackButton>
        <DateText color={colors.secondaryText}>{currentDate}</DateText>
        <Title color={colors.text}>My Todo List</Title>
      </Header>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
        renderSectionHeader={({ section: { title } }) =>
          title ? (
            <SectionHeader color={colors.secondaryText}>{title}</SectionHeader>
          ) : null
        }
        contentContainerStyle={{ padding: 16 }}
        accessibilityRole="list"
      />
      <AddButton
        onPress={() => navigation.navigate("AddTask")}
        background={colors.primary}
        accessibilityRole="button"
      >
        <ButtonText>Add New Task</ButtonText>
      </AddButton>
    </SafeAreaView>
  );
}

const Header = styled.View`
  padding: 16px;
  background-color: transparent;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 16px;
  top: 16px;
`;

const DateText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }: { color: string }) => color};
`;

const Title = styled.Text<{ color: string }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ color }: { color: string }) => color};
  margin-top: 4px;
`;

const SectionHeader = styled.Text<{ color: string }>`
  font-size: 18px;
  font-weight: bold;
  color: ${({ color }: { color: string }) => color};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const AddButton = styled.TouchableOpacity<{ background: string }>`
  margin: 16px;
  padding: 16px;
  border-radius: 24px;
  background-color: ${({ background }: { background: string }) => background};
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

export { TodoListScreen };
