/**
 * Articles リソースコンポーネント
 * List, Create, Edit, Show を一つのファイルで管理
 */
import icon from '@mui/icons-material/Article';

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

import { ARTICLE_STATUS_CHOICES } from '@example/api-types';

import { DateTimeField, DateTimeInput } from '../components/DateTime';

// ========================================
// フィルター
// ========================================

const filters = [
  <TextInput source="title:starts" label="タイトル（前方一致）" alwaysOn />,
  <SelectInput source="status" label="ステータス" choices={ARTICLE_STATUS_CHOICES} alwaysOn />,
  <TextInput source="author:starts" label="著者（前方一致）" />,
  <DateTimeInput source="createdAt:gte:date" label="作成日時（以降）" />,
  <DateTimeInput source="createdAt:lte:date" label="作成日時（以前）" />,
];

// ========================================
// List
// ========================================

const list = () => (
  <InfiniteList filters={filters} sort={{ field: 'updatedAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="title" label="タイトル" />
      <SelectField source="status" choices={ARTICLE_STATUS_CHOICES} label="ステータス" />
      <TextField source="author" label="著者" />
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
        source="content"
        label="内容"
        validate={[required()]}
        multiline
        rows={10}
        fullWidth
      />
      <SelectInput
        source="status"
        label="ステータス"
        choices={ARTICLE_STATUS_CHOICES}
        defaultValue="draft"
        validate={[required()]}
      />
      <TextInput source="author" label="著者" validate={[required()]} />
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
        source="content"
        label="内容"
        validate={[required()]}
        multiline
        rows={10}
        fullWidth
      />
      <SelectInput
        source="status"
        label="ステータス"
        choices={ARTICLE_STATUS_CHOICES}
        validate={[required()]}
      />
      <TextInput source="author" label="著者" validate={[required()]} />
      <DateTimeInput source="createdAt" label="作成日時" disabled />
      <DateTimeInput source="updatedAt" label="更新日時" disabled />
    </SimpleForm>
  </Edit>
);

// ========================================
// Show
// ========================================

export const show = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="title" label="タイトル" />
      <TextField source="content" label="内容" />
      <SelectField source="status" choices={ARTICLE_STATUS_CHOICES} label="ステータス" />
      <TextField source="author" label="著者" />
      <DateTimeField source="createdAt" label="作成日時" />
      <DateTimeField source="updatedAt" label="更新日時" />
    </SimpleShowLayout>
  </Show>
);

export default {
  name: 'articles',
  list,
  show,
  create,
  edit,
  recordRepresentation: 'title',
  icon,
};
