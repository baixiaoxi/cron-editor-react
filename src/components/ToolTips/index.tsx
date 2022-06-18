/**
 * 功能：弹框
 * 作者：白晓羲
 * 日期：2022.02.20
 */
import Tooltip from 'antd/lib/tooltip';
import { getTransitionName } from 'antd/lib/_util/motion';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import Button from 'antd/lib/button';
import type { ButtonProps, LegacyButtonType } from 'antd/lib/button/button';
import { convertLegacyProps } from 'antd/lib/button/button';
import { ConfigContext } from 'antd/lib/config-provider';
import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver';
import defaultLocale from 'antd/lib/locale/default';
import Popover from 'antd/lib/popover';
import type { AbstractTooltipProps } from 'antd/lib/tooltip';
import ActionButton from 'antd/lib/_util/ActionButton';
import type { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import { getRenderPropValue } from 'antd/lib/_util/getRenderPropValue';
import { cloneElement } from 'antd/lib/_util/reactNode';

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

  const settingVisible = (
    value: boolean,
    e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    setVisible(value);
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

    return (
      <div className={`${prefixCls}-inner-content`}>
        {mainContent}
      </div>
    );
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