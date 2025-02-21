import { Suras } from '@entities/suras';
import { Badge, Space } from 'antd';

type Props = Suras;

export const Surah = ({ text, verses, words, chars, id }: Props) => {
  return (
    <div>
      <div>{id}</div>
      <div>{text.tr}</div>
      <Space>
        <Badge overflowCount={99999999} count={`verses: ${verses}`} color="green" />
        <Badge overflowCount={99999999} count={`words: ${words}`} color="blue" />
        <Badge overflowCount={99999999} count={`chars: ${chars}`} color="purple" />
      </Space>
    </div>
  );
};
