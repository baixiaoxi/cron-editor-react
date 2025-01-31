/**
 * 功能：弹框
 * 作者：白晓羲
 * 日期：2022.02.20
 */
import * as React from 'react';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
import Tooltip, { AbstractTooltipProps } from 'antd/lib/tooltip';
import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver';
import defaultLocale from 'antd/lib/locale/default';
import { ConfigContext } from 'antd/lib/config-provider';
import { cloneElement } from 'antd/lib/_util/reactNode';
import { getTransitionName } from 'antd/lib/_util/motion';
import useDestroyed from 'antd/lib/_util/hooks/useDestroyed';

export interface PopconfirmProps extends AbstractTooltipProps {
  mainContent?: React.ReactNode;
  disabled?: boolean;
  onVisibleChange?: (
    visible: boolean,
    e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
}

export interface PopconfirmState {
  visible?: boolean;
}

const Popconfirm = React.forwardRef<unknown, PopconfirmProps>((props, ref) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const [visible, setVisible] = useMergedState(false, {
    value: props.visible,
    defaultValue: props.defaultVisible,
  });

  const isDestroyed = useDestroyed();

  const settingVisible = (
    value: boolean,
    e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!isDestroyed()) {
      setVisible(value);
    }
    props.onVisibleChange?.(value, e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KeyCode.ESC && visible) {
      settingVisible(false, e);
    }
  };

  const onVisibleChange = (value: boolean) => {
    const { disabled } = props;
    if (disabled) {
      return;
    }
    settingVisible(value);
  };

  const renderOverlay = (prefixCls: string) => {
    const { mainContent } = props;

    return <div className={`${prefixCls}-inner-content`}>{mainContent}</div>;
  };

  const {
    prefixCls: customizePrefixCls,
    placement,
    children,
    overlayClassName,
    ...restProps
  } = props;
  const prefixCls = getPrefixCls('popover', customizePrefixCls);
  const prefixClsConfirm = getPrefixCls('popconfirm', customizePrefixCls);
  const overlayClassNames = classNames(prefixClsConfirm, overlayClassName);

  const overlay = (
    <LocaleReceiver componentName="Popconfirm" defaultLocale={defaultLocale.Popconfirm}>
      {() => renderOverlay(prefixCls)}
    </LocaleReceiver>
  );
  const rootPrefixCls = getPrefixCls();

  return (
    <Tooltip
      {...restProps}
      prefixCls={prefixCls}
      placement={placement}
      onVisibleChange={onVisibleChange}
      visible={visible}
      overlay={overlay}
      overlayClassName={overlayClassNames}
      ref={ref as any}
      transitionName={getTransitionName(rootPrefixCls, 'zoom-big', props.transitionName)}
    >
      {cloneElement(children, {
        onKeyDown: (e: React.KeyboardEvent<any>) => {
          if (React.isValidElement(children)) {
            children?.props.onKeyDown?.(e);
          }
          onKeyDown(e);
        },
      })}
    </Tooltip>
  );
});

Popconfirm.defaultProps = {
  placement: 'top' as PopconfirmProps['placement'],
  trigger: 'click' as PopconfirmProps['trigger'],
  disabled: false,
};

export default Popconfirm;
