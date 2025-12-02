/**
 * Tasks リソースコンポーネント
 * List, Create, Edit, Show を一つのファイルで管理
 */
import icon from '@mui/icons-material/Task';

import {
  Create,
  Datagrid,
  Edit,
  InfiniteList,
  SelectField,
  SelectInput,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  required,
} from 'react-admin';

import { TASK_PRIORITY_CHOICES, TASK_STATUS_CHOICES } from '@example/api-types';

import { DateTimeField, DateTimeInput } from '../components/DateTime';

// ========================================
// フィルター
// ========================================

const filters = [
  <SelectInput source="status" label="ステータス" choices={TASK_STATUS_CHOICES} alwaysOn />,
  <SelectInput source="priority" label="優先度" choices={TASK_PRIORITY_CHOICES} alwaysOn />,
  <TextInput source="title:starts" label="タイトル（前方一致）" />,
  <DateTimeInput source="dueDate:gte:date" label="期限日時（以降）" />,
  <DateTimeInput source="dueDate:lte:date" label="期限日時（以前）" />,
];

// ========================================
// List
// ========================================

const list = () => (
  <InfiniteList filters={filters} sort={{ field: 'updatedAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="title" label="タイトル" />
      <SelectField source="status" choices={TASK_STATUS_CHOICES} label="ステータス" />
      <SelectField source="priority" choices={TASK_PRIORITY_CHOICES} label="優先度" />
      <DateTimeField source="dueDate" label="期限日時" />
      <DateTimeField source="createdAt" label="作成日時" />
      <DateTimeField source="updatedAt" label="更新日時" />
    </Datagrid>
  </InfiniteList>
);

// ========================================
// Create
// ========================================

const create = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="タイトル" validate={[required()]} fullWidth />
      <TextInput
        source="description"
        label="説明"
        validate={[required()]}
        multiline
        rows={4}
        fullWidth
      />
      <SelectInput
        source="status"
        label="ステータス"
        choices={TASK_STATUS_CHOICES}
        defaultValue="todo"
        validate={[required()]}
      />
      <SelectInput
        source="priority"
        label="優先度"
        choices={TASK_PRIORITY_CHOICES}
        defaultValue="medium"
        validate={[required()]}
      />
      <DateTimeInput source="dueDate" label="期限日時" />
    </SimpleForm>
  </Create>
);

// ========================================
// Edit
// ========================================

const edit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" label="ID" disabled />
      <TextInput source="title" label="タイトル" validate={[required()]} fullWidth />
      <TextInput
        source="description"
        label="説明"
        validate={[required()]}
        multiline
        rows={4}
        fullWidth
      />
      <SelectInput
        source="status"
        label="ステータス"
        choices={TASK_STATUS_CHOICES}
        validate={[required()]}
      />
      <SelectInput
        source="priority"
        label="優先度"
        choices={TASK_PRIORITY_CHOICES}
        validate={[required()]}
      />
      <DateTimeInput source="dueDate" label="期限日時" />
      <DateTimeInput source="createdAt" label="作成日時" disabled />
      <DateTimeInput source="updatedAt" label="更新日時" disabled />
    </SimpleForm>
  </Edit>
);

// ========================================
// Show
// ========================================

const show = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="タイトル" />
      <TextField source="description" label="説明" />
      <SelectField source="status" choices={TASK_STATUS_CHOICES} label="ステータス" />
      <SelectField source="priority" choices={TASK_PRIORITY_CHOICES} label="優先度" />
      <DateTimeField source="dueDate" label="期限日時" />
      <DateTimeField source="createdAt" label="作成日時" />
      <DateTimeField source="updatedAt" label="更新日時" />
    </SimpleShowLayout>
  </Show>
);

export default {
  name: 'tasks',
  list,
  show,
  create,
  edit,
  recordRepresentation: 'title',
  icon,
};
