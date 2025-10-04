import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useTaskStore } from "../store/taskStore";
import { Task } from "../types/tasks";
import { useColors } from "../theme/color";
import { format } from "date-fns";

// Use the icon name type from MaterialCommunityIcons for stronger typing
type MCIIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const categoryIcons: Record<Task["category"], MCIIconName> = {
  note: "note-outline",
  event: "calendar-outline",
  goal: "trophy-outline",
};

const categoryColors: Record<Task["category"], string> = {
  note: "#AEC6CF",
  event: "#D7BDE2",
  goal: "#F7DC6F",
};

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const colors = useColors();
  const toggleComplete = useTaskStore((state) => state.toggleComplete);

  return (
    <Container background={colors.card} borderColor={colors.border}>
      <IconContainer background={categoryColors[task.category]}>
        <MaterialCommunityIcons
          name={categoryIcons[task.category]}
          size={24}
          color={colors.primary}
        />
      </IconContainer>
      <Content>
        <Title color={colors.text}>{task.title}</Title>
        <Row>
          <DateText color={colors.secondaryText}>{format(task.date, "MMMM dd, yyyy")}</DateText>
          <Time color={colors.secondaryText}>{task.time}</Time>
        </Row>
      </Content>
      <ActionContainer>
        <Checkbox
          onPress={() => toggleComplete(task.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
        >
          <MaterialCommunityIcons
            name={task.completed ? "checkbox-marked" : "checkbox-blank-outline"}
            size={24}
            color={task.completed ? colors.completed : colors.primary}
          />
        </Checkbox>
        <ActionButton onPress={() => onEdit(task)} accessibilityRole="button">
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.primary}
          />
        </ActionButton>
        <ActionButton
          onPress={() => onDelete(task.id)}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={colors.accent}
          />
        </ActionButton>
      </ActionContainer>
    </Container>
  );
}

const Container = styled.View<{ background: string; borderColor: string }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: ${({ background }: { background: string }) => background};
  border-width: 1px;
  border-color: ${({ borderColor }: { borderColor: string }) => borderColor};
`;

const IconContainer = styled.View<{ background: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${({ background }: { background: string }) => background};
`;

const Content = styled.View`
  flex: 1;
  margin-left: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  gap: 8px;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ color }: { color: string }) => color};
`;

const Time = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }: { color: string }) => color};
`;

const DateText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }: { color: string }) => color};
`;

const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Checkbox = styled(TouchableOpacity)`
  margin-left: 16px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: 4px;
  margin-left: 8px;
`;

export { TaskItem };
