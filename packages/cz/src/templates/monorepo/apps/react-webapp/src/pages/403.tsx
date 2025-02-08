import { history } from '@umijs/max';
import { Button, Result } from 'antd';

const NoFoundPage: React.FC = () => (
  <Result
    status="403"
    title="抱歉，您无权访问该页面"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
